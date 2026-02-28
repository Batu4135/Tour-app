import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_PRODUCTS = [
  { sku: "NP-001", name: "Alufolie 300m", defaultPriceCents: 1990 },
  { sku: "NP-002", name: "Servietten Premium", defaultPriceCents: 2090 },
  { sku: "NP-003", name: "Menueboxen 2-geteilt", defaultPriceCents: 2790 },
  { sku: "NP-004", name: "Menueboxen 3-geteilt", defaultPriceCents: 3190 },
  { sku: "NP-005", name: "Pappbecher 300ml", defaultPriceCents: 1890 },
  { sku: "NP-006", name: "Deckel fuer Becher", defaultPriceCents: 1290 },
  { sku: "NP-007", name: "Holzgabeln", defaultPriceCents: 990 },
  { sku: "NP-008", name: "Muellsaecke 120L", defaultPriceCents: 1590 },
  { sku: "NP-009", name: "Kuechenreiniger", defaultPriceCents: 890 }
] as const;

const DEMO_CUSTOMERS = [
  {
    name: "Konak Kiel",
    address: "Holstenstrasse 18, 24103 Kiel",
    phone: "+49 431 100200",
    routeDay: "Montag"
  },
  {
    name: "Burger Bank",
    address: "Knooper Weg 7, 24103 Kiel",
    phone: "+49 431 300400",
    routeDay: "Dienstag"
  },
  {
    name: "Kieler Brauerei",
    address: "Werftbahnstrasse 12, 24143 Kiel",
    phone: "+49 431 500600",
    routeDay: "Freitag"
  }
] as const;

const DEMO_CUSTOMER_PRICES: Record<string, Array<{ sku: string; priceCents: number }>> = {
  "Konak Kiel": [
    { sku: "NP-001", priceCents: 1990 },
    { sku: "NP-002", priceCents: 2090 },
    { sku: "NP-003", priceCents: 2790 },
    { sku: "NP-005", priceCents: 1890 },
    { sku: "NP-007", priceCents: 990 }
  ],
  "Burger Bank": [
    { sku: "NP-001", priceCents: 1940 },
    { sku: "NP-002", priceCents: 2050 },
    { sku: "NP-003", priceCents: 2690 },
    { sku: "NP-004", priceCents: 3190 },
    { sku: "NP-006", priceCents: 1290 },
    { sku: "NP-008", priceCents: 1590 }
  ],
  "Kieler Brauerei": [
    { sku: "NP-002", priceCents: 2190 },
    { sku: "NP-003", priceCents: 2850 },
    { sku: "NP-004", priceCents: 3290 },
    { sku: "NP-005", priceCents: 1990 },
    { sku: "NP-006", priceCents: 1350 },
    { sku: "NP-009", priceCents: 890 }
  ]
};

function isValidPin(pin: string): boolean {
  return /^\d{6,10}$/.test(pin);
}

async function ensureAdminUser() {
  const defaultPin = (process.env.DEFAULT_ADMIN_PIN ?? "123456").trim();
  if (!isValidPin(defaultPin)) {
    throw new Error("DEFAULT_ADMIN_PIN muss 6 bis 10 Ziffern haben.");
  }

  const firstUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  const shouldResetPin = process.env.RESET_ADMIN_PIN === "true";

  if (!firstUser) {
    const pinHash = await bcrypt.hash(defaultPin, 12);
    const created = await prisma.user.create({ data: { pinHash } });
    console.log(`[seed] Admin-User erstellt (id=${created.id}).`);
    return;
  }

  if (shouldResetPin) {
    const pinHash = await bcrypt.hash(defaultPin, 12);
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { pinHash }
    });
    console.log(`[seed] Admin-PIN fuer user id=${firstUser.id} wurde zurueckgesetzt.`);
    return;
  }

  console.log("[seed] Admin-User existiert bereits, PIN bleibt unveraendert.");
}

async function upsertCustomerByName(data: (typeof DEMO_CUSTOMERS)[number]) {
  const existing = await prisma.customer.findFirst({
    where: { name: data.name },
    select: { id: true }
  });

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        address: data.address,
        phone: data.phone,
        routeDay: data.routeDay
      }
    });
  }

  return prisma.customer.create({
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      routeDay: data.routeDay
    }
  });
}

async function seedDemoData() {
  const products = await Promise.all(
    DEMO_PRODUCTS.map((product) =>
      prisma.product.upsert({
        where: { sku: product.sku },
        create: {
          sku: product.sku,
          name: product.name,
          defaultPriceCents: product.defaultPriceCents,
          isActive: true
        },
        update: {
          name: product.name,
          defaultPriceCents: product.defaultPriceCents,
          isActive: true
        }
      })
    )
  );

  const productBySku = new Map(products.map((product) => [product.sku, product]));
  const customers = await Promise.all(DEMO_CUSTOMERS.map((customer) => upsertCustomerByName(customer)));
  const customerByName = new Map(customers.map((customer) => [customer.name, customer]));

  for (const [customerName, prices] of Object.entries(DEMO_CUSTOMER_PRICES)) {
    const customer = customerByName.get(customerName);
    if (!customer) continue;

    for (const row of prices) {
      const product = productBySku.get(row.sku);
      if (!product) continue;

      await prisma.customerPrice.upsert({
        where: {
          customerId_productId: {
            customerId: customer.id,
            productId: product.id
          }
        },
        create: {
          customerId: customer.id,
          productId: product.id,
          priceCents: row.priceCents
        },
        update: {
          priceCents: row.priceCents
        }
      });
    }
  }

  console.log(`[seed] Demo-Daten aktualisiert: products=${products.length}, customers=${customers.length}`);
}

async function main() {
  await ensureAdminUser();

  if (process.env.SEED_DEMO_DATA === "true") {
    await seedDemoData();
  } else {
    console.log("[seed] Demo-Daten uebersprungen (SEED_DEMO_DATA != true).");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("[seed] Fehler:", error instanceof Error ? error.message : error);
    await prisma.$disconnect();
    process.exit(1);
  });
