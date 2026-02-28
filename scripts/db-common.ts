import fs from "fs/promises";
import path from "path";

export type PostgresConnectionInfo = {
  rawUrl: string;
  uri: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  sslMode: string;
};

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

async function loadEnvFile(filePath: string): Promise<void> {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalIndex = trimmed.indexOf("=");
    if (equalIndex < 1) continue;

    const key = trimmed.slice(0, equalIndex).trim();
    const rawValue = trimmed.slice(equalIndex + 1);
    if (!key || process.env[key] !== undefined) continue;

    const value = stripWrappingQuotes(rawValue).replace(/\\n/g, "\n");
    process.env[key] = value;
  }
}

export async function loadProjectEnv(): Promise<void> {
  const root = process.cwd();
  const envFiles = [".env.local", ".env"];

  for (const file of envFiles) {
    const fullPath = path.join(root, file);
    try {
      await loadEnvFile(fullPath);
    } catch {
      // ignore missing/unreadable files
    }
  }
}

function normalizeDbPath(pathname: string): string {
  return pathname.replace(/^\/+/, "");
}

function buildPostgresUri(info: {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
  sslMode: string;
}): string {
  const encodedUser = encodeURIComponent(info.user);
  const encodedPassword = encodeURIComponent(info.password);
  const encodedDatabase = info.database
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const auth = info.password ? `${encodedUser}:${encodedPassword}` : encodedUser;
  return `postgres://${auth}@${info.host}:${info.port}/${encodedDatabase}?sslmode=${encodeURIComponent(info.sslMode)}`;
}

export async function getPostgresConnectionInfo(): Promise<PostgresConnectionInfo> {
  await loadProjectEnv();
  const rawUrl = (process.env.DATABASE_URL ?? "").trim();
  if (!rawUrl) {
    throw new Error("DATABASE_URL fehlt. Bitte in .env setzen.");
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("DATABASE_URL ist kein gueltiger URL-String.");
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new Error("DATABASE_URL muss mit postgresql:// oder postgres:// beginnen.");
  }

  const host = parsed.hostname;
  const port = parsed.port ? Number.parseInt(parsed.port, 10) : 5432;
  const database = normalizeDbPath(parsed.pathname);
  const user = decodeURIComponent(parsed.username);
  const password = decodeURIComponent(parsed.password);
  const sslMode = parsed.searchParams.get("sslmode")?.trim() || "require";

  if (!host || !database || !user) {
    throw new Error("DATABASE_URL unvollstaendig. Erwartet: user, host, dbname.");
  }
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("DATABASE_URL enthaelt einen ungueltigen Port.");
  }

  const uri = buildPostgresUri({ user, password, host, port, database, sslMode });
  return { rawUrl, uri, host, port, database, user, password, sslMode };
}
