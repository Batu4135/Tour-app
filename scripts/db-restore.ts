import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { getPostgresConnectionInfo } from "./db-common";

function usage(): string {
  return 'Nutzung: npm run db:restore -- "C:\\\\pfad\\\\zum\\\\dump.sql"';
}

function runPsql(args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("psql", args, { stdio: "inherit", env });

    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        reject(
          new Error(
            "psql nicht gefunden. Bitte PostgreSQL Client Tools installieren und PATH setzen."
          )
        );
        return;
      }
      reject(error);
    });

    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`psql wurde mit Exit-Code ${code} beendet.`));
    });
  });
}

async function main() {
  const dumpArg = process.argv[2];
  if (!dumpArg) {
    throw new Error(`SQL-Datei fehlt. ${usage()}`);
  }

  const dumpPath = path.resolve(process.cwd(), dumpArg);
  await fs.access(dumpPath).catch(() => {
    throw new Error(`SQL-Datei nicht gefunden: ${dumpPath}`);
  });

  const info = await getPostgresConnectionInfo();
  const args = [
    "--host",
    info.host,
    "--port",
    String(info.port),
    "--username",
    info.user,
    "--dbname",
    info.database,
    "--set",
    "ON_ERROR_STOP=on",
    "--single-transaction",
    "--file",
    dumpPath
  ];

  const env = {
    ...process.env,
    PGPASSWORD: info.password,
    PGSSLMODE: info.sslMode
  };

  console.log(`[db:restore] Stelle wieder her aus: ${dumpPath}`);
  await runPsql(args, env);
  console.log("[db:restore] Restore abgeschlossen.");
}

main().catch((error) => {
  console.error("[db:restore] Fehler:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
