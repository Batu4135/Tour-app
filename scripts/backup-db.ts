import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type BackupPayload = {
  meta: {
    createdAt: string;
    version: string;
  };
  products: unknown[];
  productAliases: unknown[];
  customers: unknown[];
  customerPrices: unknown[];
  invoices: unknown[];
  invoiceItems: unknown[];
  drafts: unknown[];
  draftLines: unknown[];
  invoiceRevisions: unknown[];
};

function parseRetentionDays(): number {
  const raw = Number.parseInt(process.env.BACKUP_RETENTION_DAYS ?? "30", 10);
  if (!Number.isFinite(raw) || raw < 1) return 30;
  return raw;
}

function assertCloudDatabaseUrl() {
  const url = (process.env.DATABASE_URL ?? "").trim();
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return;
  }
  throw new Error(
    "DATABASE_URL ist ungueltig. Fuer Cloud-Backups wird eine Neon/Postgres URL benoetigt (postgresql://...)."
  );
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function cleanupOldBackups(root: string, retentionDays: number) {
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(root, entry.name);
    const stat = await fs.stat(fullPath);
    if (stat.mtimeMs < cutoff) {
      await fs.rm(fullPath, { recursive: true, force: true });
    }
  }
}

function bytesToMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  assertCloudDatabaseUrl();

  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const stamp = now.toISOString().replace(/[:.]/g, "-");

  const backupRoot = path.join(process.cwd(), "backups");
  const dayDir = path.join(backupRoot, day);
  const filePath = path.join(dayDir, `backup-${stamp}.json`);

  await ensureDir(dayDir);

  const [products, productAliases, customers, customerPrices, drafts, draftLines, invoiceRevisions] =
    await Promise.all([
      prisma.product.findMany({ orderBy: { id: "asc" } }),
      prisma.productAlias.findMany({ orderBy: { id: "asc" } }),
      prisma.customer.findMany({ orderBy: { id: "asc" } }),
      prisma.customerPrice.findMany({ orderBy: { id: "asc" } }),
      prisma.draft.findMany({ orderBy: { id: "asc" } }),
      prisma.draftLine.findMany({ orderBy: { id: "asc" } }),
      (prisma as any).invoiceRevision
        ? (prisma as any).invoiceRevision.findMany({ orderBy: { id: "asc" } })
        : Promise.resolve([])
    ]);

  const payload: BackupPayload = {
    meta: {
      createdAt: now.toISOString(),
      version: "1"
    },
    products,
    productAliases,
    customers,
    customerPrices,
    invoices: drafts,
    invoiceItems: draftLines,
    drafts,
    draftLines,
    invoiceRevisions
  };

  const json = JSON.stringify(payload, null, 2);
  await fs.writeFile(filePath, json, "utf8");

  const stats = await fs.stat(filePath);
  const retentionDays = parseRetentionDays();
  await cleanupOldBackups(backupRoot, retentionDays);

  console.log(`[backup] Datei: ${filePath}`);
  console.log(`[backup] Groesse: ${bytesToMb(stats.size)}`);
  console.log(
    `[backup] Datensaetze: products=${products.length}, aliases=${productAliases.length}, customers=${customers.length}, drafts=${drafts.length}, draftLines=${draftLines.length}, revisions=${invoiceRevisions.length}`
  );
  console.log(`[backup] Rotation: ${retentionDays} Tage`);
}

main()
  .catch((error) => {
    console.error("[backup] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
