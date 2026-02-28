import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { getPostgresConnectionInfo } from "./db-common";

function timestampForFile(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function resolveOutputPath(rawArg?: string): Promise<string> {
  if (rawArg && rawArg.trim()) {
    const custom = path.resolve(process.cwd(), rawArg.trim());
    await fs.mkdir(path.dirname(custom), { recursive: true });
    return custom;
  }

  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const dir = path.join(process.cwd(), "backups", "sql", day);
  await fs.mkdir(dir, { recursive: true });
  return path.join(dir, `dump-${timestampForFile(now)}.sql`);
}

function runPgDump(args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pg_dump", args, { stdio: "inherit", env });

    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "pg_dump nicht gefunden. Bitte PostgreSQL Client Tools installieren und PATH setzen."
          )
        );
        return;
      }
      reject(error);
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pg_dump wurde mit Exit-Code ${code} beendet.`));
    });
  });
}

async function main() {
  const info = await getPostgresConnectionInfo();
  const outputPath = await resolveOutputPath(process.argv[2]);

  const args = [
    "--format=plain",
    "--no-owner",
    "--no-privileges",
    "--clean",
    "--if-exists",
    "--file",
    outputPath,
    "--host",
    info.host,
    "--port",
    String(info.port),
    "--username",
    info.user,
    "--dbname",
    info.database
  ];

  const env = {
    ...process.env,
    PGPASSWORD: info.password,
    PGSSLMODE: info.sslMode
  };

  console.log("[db:dump] Starte SQL-Dump...");
  await runPgDump(args, env);
  const stat = await fs.stat(outputPath);
  console.log(`[db:dump] Fertig: ${outputPath}`);
  console.log(`[db:dump] Groesse: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

main().catch((error) => {
  console.error("[db:dump] Fehler:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
