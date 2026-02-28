import { PrismaClient as CloudPrismaClient } from "@prisma/client";
if (!process.env.LOCAL_DATABASE_URL) {
  process.env.LOCAL_DATABASE_URL = "file:./local.db";
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient: LocalPrismaClient } = require("../prisma/generated/local-client");

const cloud: any = new CloudPrismaClient();
const local: any = new LocalPrismaClient();

function assertCloudDatabaseUrl() {
  const url = (process.env.DATABASE_URL ?? "").trim();
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return;
  }
  throw new Error(
    "DATABASE_URL ist ungueltig. pull:local benoetigt eine Neon/Postgres URL (postgresql://...)."
  );
}

async function ensureLocalSchema() {
  await local.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "pinHash" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    );
  `);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "address" TEXT,
      "phone" TEXT,
      "routeDay" TEXT,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    );
  `);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "sku" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "defaultPriceCents" INTEGER,
      "isActive" BOOLEAN NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL
    );
  `);
  await local.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");`);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ProductAlias" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "productId" INTEGER NOT NULL,
      "alias" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  await local.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "ProductAlias_productId_alias_key" ON "ProductAlias"("productId","alias");`
  );

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CustomerPrice" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "customerId" INTEGER NOT NULL,
      "productId" INTEGER NOT NULL,
      "priceCents" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);
  await local.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "CustomerPrice_customerId_productId_key" ON "CustomerPrice"("customerId","productId");`
  );

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Draft" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "customerId" INTEGER NOT NULL,
      "date" DATETIME NOT NULL,
      "note" TEXT,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "DraftLine" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "draftId" INTEGER NOT NULL,
      "productId" INTEGER NOT NULL,
      "quantity" INTEGER NOT NULL,
      "unitPriceCents" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("draftId") REFERENCES "Draft"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `);

  await local.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "InvoiceRevision" (
      "id" INTEGER NOT NULL PRIMARY KEY,
      "invoiceId" INTEGER NOT NULL,
      "payloadJson" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL,
      "updatedAt" DATETIME NOT NULL,
      "createdBy" INTEGER,
      FOREIGN KEY ("invoiceId") REFERENCES "Draft"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );
  `);
}

async function main() {
  assertCloudDatabaseUrl();
  await ensureLocalSchema();

  const [users, customers, products, productAliases, customerPrices, drafts, draftLines, invoiceRevisions] =
    await Promise.all([
      cloud.user.findMany({ orderBy: { id: "asc" } }),
      cloud.customer.findMany({ orderBy: { id: "asc" } }),
      cloud.product.findMany({ orderBy: { id: "asc" } }),
      cloud.productAlias.findMany({ orderBy: { id: "asc" } }),
      cloud.customerPrice.findMany({ orderBy: { id: "asc" } }),
      cloud.draft.findMany({ orderBy: { id: "asc" } }),
      cloud.draftLine.findMany({ orderBy: { id: "asc" } }),
      (cloud as any).invoiceRevision
        ? (cloud as any).invoiceRevision.findMany({ orderBy: { id: "asc" } })
        : Promise.resolve([])
    ]);

  await local.$transaction(async (tx: any) => {
    await tx.invoiceRevision.deleteMany();
    await tx.draftLine.deleteMany();
    await tx.draft.deleteMany();
    await tx.customerPrice.deleteMany();
    await tx.productAlias.deleteMany();
    await tx.product.deleteMany();
    await tx.customer.deleteMany();
    await tx.user.deleteMany();

    if (users.length) {
      await tx.user.createMany({
        data: users.map((item: any) => ({
          id: item.id,
          pinHash: item.pinHash,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (customers.length) {
      await tx.customer.createMany({
        data: customers.map((item: any) => ({
          id: item.id,
          name: item.name,
          address: item.address,
          phone: item.phone,
          routeDay: item.routeDay,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (products.length) {
      await tx.product.createMany({
        data: products.map((item: any) => ({
          id: item.id,
          sku: item.sku,
          name: item.name,
          defaultPriceCents: item.defaultPriceCents,
          isActive: item.isActive,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (productAliases.length) {
      await tx.productAlias.createMany({
        data: productAliases.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          alias: item.alias,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (customerPrices.length) {
      await tx.customerPrice.createMany({
        data: customerPrices.map((item: any) => ({
          id: item.id,
          customerId: item.customerId,
          productId: item.productId,
          priceCents: item.priceCents,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (drafts.length) {
      await tx.draft.createMany({
        data: drafts.map((item: any) => ({
          id: item.id,
          customerId: item.customerId,
          date: item.date,
          note: item.note,
          createdAt: item.createdAt ?? item.date ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? item.date ?? new Date(0)
        }))
      });
    }

    if (draftLines.length) {
      await tx.draftLine.createMany({
        data: draftLines.map((item: any) => ({
          id: item.id,
          draftId: item.draftId,
          productId: item.productId,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0)
        }))
      });
    }

    if (invoiceRevisions.length) {
      await tx.invoiceRevision.createMany({
        data: invoiceRevisions.map((item: any) => ({
          id: item.id,
          invoiceId: item.invoiceId,
          payloadJson: JSON.stringify(item.payloadJson ?? {}),
          createdAt: item.createdAt ?? new Date(0),
          updatedAt: item.updatedAt ?? item.createdAt ?? new Date(0),
          createdBy: item.createdBy
        }))
      });
    }
  });

  console.log("[pull:local] Synchronisierung abgeschlossen.");
  console.log(
    `[pull:local] users=${users.length}, customers=${customers.length}, products=${products.length}, drafts=${drafts.length}, draftLines=${draftLines.length}, revisions=${invoiceRevisions.length}`
  );
}

main()
  .catch((error) => {
    console.error("[pull:local] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cloud.$disconnect();
    await local.$disconnect();
  });
