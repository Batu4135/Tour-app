import bcrypt from "bcryptjs";
import { PaymentMethod, PrismaClient } from "@prisma/client";

import { computeLicenseFeeCents, LICENSE_MATERIAL_CODES } from "../lib/license";

const prisma = new PrismaClient();

const CITIES = [
  "Bremen",
  "Kiel",
  "Neumuenster",
  "Hamburg",
  "Luebeck",
  "Bremerhaven",
  "Hannover",
  "Oldenburg",
  "Flensburg",
  "Rostock",
  "Berlin",
  "Osnabrueck",
  "Cuxhaven"
] as const;

const TOUR_CLUSTERS: Array<readonly string[]> = [
  ["Bremen"],
  ["Hamburg"],
  ["Luebeck"],
  ["Hannover"],
  ["Oldenburg"],
  ["Flensburg"],
  ["Rostock"],
  ["Berlin"],
  ["Osnabrueck"],
  ["Bremerhaven", "Cuxhaven"],
  ["Kiel", "Neumuenster"]
];

const CUSTOMER_PREFIXES = [
  "Anadolu",
  "Marmara",
  "Sultan",
  "Pistachio",
  "Konak",
  "Bosphor",
  "Mavi",
  "Altin",
  "Han",
  "Saray",
  "Yildiz",
  "Lezzet"
] as const;

const CUSTOMER_SUFFIXES = [
  "Market",
  "Ocakbasi",
  "Restaurant",
  "Imbiss",
  "Bistro",
  "Doener",
  "Pizzeria",
  "Cafe",
  "Baeckerei",
  "Grillhaus"
] as const;

const PRODUCT_WORDS_A = [
  "Alu",
  "Papier",
  "Snack",
  "Dressing",
  "Salat",
  "Suppen",
  "Deli",
  "Jumbo",
  "Thermo",
  "Premium",
  "Eco",
  "Profi"
] as const;

const PRODUCT_WORDS_B = [
  "Box",
  "Deckel",
  "Becher",
  "Schale",
  "Teller",
  "Tuete",
  "Folie",
  "Serviette",
  "Tragetasche",
  "Besteck",
  "Hemdchentragetasche",
  "Menuebox"
] as const;

function rng(seed = 42) {
  let x = seed >>> 0;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
}

const random = rng(20260319);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]!;
}

function int(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function isValidPin(pin: string): boolean {
  return /^\d{6,10}$/.test(pin);
}

async function ensureAdminUser() {
  const defaultPin = (process.env.DEFAULT_ADMIN_PIN ?? "123456").trim();
  if (!isValidPin(defaultPin)) {
    throw new Error("DEFAULT_ADMIN_PIN muss 6 bis 10 Ziffern haben.");
  }

  const firstUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (firstUser) return;

  const pinHash = await bcrypt.hash(defaultPin, 12);
  await prisma.user.create({ data: { pinHash } });
}

async function wipeBusinessData() {
  await prisma.invoiceRevision.deleteMany();
  await prisma.draftLine.deleteMany();
  await prisma.draft.deleteMany();
  await prisma.customerPrice.deleteMany();
  await prisma.productAlias.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.product.deleteMany();
}

async function seedProducts(productCount: number) {
  const rows = Array.from({ length: productCount }, (_, i) => {
    const skuNum = 10000 + i;
    const hasLicense = random() >= 0.28;
    const licenseMaterial = hasLicense ? pick(LICENSE_MATERIAL_CODES) : null;
    const licenseWeightGrams = hasLicense ? int(80, 9500) : 0;
    const licenseBase = computeLicenseFeeCents(licenseMaterial, licenseWeightGrams);
    return {
      sku: `T${skuNum}`,
      name: `${pick(PRODUCT_WORDS_A)} ${pick(PRODUCT_WORDS_B)} ${int(100, 999)} Stk.`,
      defaultPriceCents: int(350, 15900),
      licenseFeeCents: licenseBase,
      licenseMaterial,
      licenseWeightGrams,
      isActive: true
    };
  });

  for (const part of chunk(rows, 200)) {
    await prisma.product.createMany({ data: part });
  }

  return prisma.product.findMany({
    select: {
      id: true,
      sku: true,
      name: true,
      defaultPriceCents: true,
      licenseFeeCents: true,
      licenseMaterial: true,
      licenseWeightGrams: true
    }
  });
}

async function seedCustomers(customerCount: number) {
  const rows = Array.from({ length: customerCount }, (_, i) => {
    const city = CITIES[i % CITIES.length];
    const prefix = pick(CUSTOMER_PREFIXES);
    const suffix = pick(CUSTOMER_SUFFIXES);
    return {
      name: `${prefix} ${suffix} ${city} ${i + 1}`,
      address: `${int(1, 180)} ${city} Strasse, ${int(20000, 29999)} ${city}`,
      phone: `+49 ${int(150, 179)} ${int(1000000, 9999999)}`,
      routeDay: city
    };
  });

  for (const part of chunk(rows, 200)) {
    await prisma.customer.createMany({ data: part });
  }

  return prisma.customer.findMany({
    select: { id: true, name: true, routeDay: true }
  });
}

async function seedCustomerPrices(customers: Array<{ id: number }>, products: Array<{ id: number; defaultPriceCents: number | null }>) {
  const rows: Array<{ customerId: number; productId: number; priceCents: number }> = [];

  for (const customer of customers) {
    const targetCount = int(18, 42);
    const pool = [...products];
    for (let i = 0; i < targetCount && pool.length > 0; i += 1) {
      const idx = int(0, pool.length - 1);
      const product = pool.splice(idx, 1)[0]!;
      const base = product.defaultPriceCents ?? int(500, 9000);
      const factor = 0.82 + random() * 0.42;
      const priceCents = Math.max(100, Math.round(base * factor));
      rows.push({ customerId: customer.id, productId: product.id, priceCents });
    }
  }

  for (const part of chunk(rows, 1000)) {
    await prisma.customerPrice.createMany({ data: part });
  }
}

function chooseTourCluster(dayIndex: number): readonly string[] {
  const pairClusters = TOUR_CLUSTERS.filter((cluster) => cluster.length > 1);
  const singleClusters = TOUR_CLUSTERS.filter((cluster) => cluster.length === 1);

  // Most tours are single-city tours, pair tours are exceptions.
  if (random() < 0.8) {
    return singleClusters[dayIndex % singleClusters.length]!;
  }
  return pairClusters[dayIndex % pairClusters.length]!;
}

async function seedDrafts(customers: Array<{ id: number; routeDay: string | null }>) {
  const customerPrices = await prisma.customerPrice.findMany({
    select: { customerId: true, productId: true, priceCents: true }
  });

  const byCustomer = new Map<number, Array<{ productId: number; priceCents: number }>>();
  for (const row of customerPrices) {
    const list = byCustomer.get(row.customerId) ?? [];
    list.push({ productId: row.productId, priceCents: row.priceCents });
    byCustomer.set(row.customerId, list);
  }

  const byCity = new Map<string, Array<{ id: number; routeDay: string | null }>>();
  for (const customer of customers) {
    const city = (customer.routeDay ?? "").trim();
    if (!city) continue;
    const list = byCity.get(city) ?? [];
    list.push(customer);
    byCity.set(city, list);
  }

  const now = new Date();
  const dayWindow = 42;
  let createdDrafts = 0;

  for (let dayIndex = 0; dayIndex < dayWindow; dayIndex += 1) {
    // A few days without tours are realistic.
    if (random() < 0.1) continue;

    const cluster = chooseTourCluster(dayIndex);
    const tourCustomers = cluster.flatMap((city) => byCity.get(city) ?? []);
    if (tourCustomers.length === 0) continue;

    const draftsForDay = int(10, 28);
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - dayIndex);
    dayDate.setHours(0, 0, 0, 0);

    const dayClosed = random() < 0.68;
    const closedAtBase = dayClosed ? new Date(dayDate.getTime() + int(13, 21) * 3600000) : null;

    for (let i = 0; i < draftsForDay; i += 1) {
      const customer = tourCustomers[int(0, tourCustomers.length - 1)]!;
      const pricedProducts = byCustomer.get(customer.id);
      if (!pricedProducts || pricedProducts.length === 0) continue;

      const draftDate = new Date(dayDate);
      draftDate.setHours(int(6, 18), int(0, 59), int(0, 59), 0);

      const includeLicenseFee = random() < 0.45;
      const paymentMethod = pick([PaymentMethod.CASH, PaymentMethod.BANK, PaymentMethod.DIRECT_DEBIT] as const);
      const lineCount = int(1, 9);

      const pool = [...pricedProducts];
      const lines: Array<{ productId: number; quantity: number; unitPriceCents: number }> = [];
      for (let lineIdx = 0; lineIdx < lineCount && pool.length > 0; lineIdx += 1) {
        const idx = int(0, pool.length - 1);
        const item = pool.splice(idx, 1)[0]!;
        lines.push({
          productId: item.productId,
          quantity: int(1, 14),
          unitPriceCents: item.priceCents
        });
      }

      if (lines.length === 0) continue;

      await prisma.draft.create({
        data: {
          customerId: customer.id,
          date: draftDate,
          includeLicenseFee,
          paymentMethod,
          tourClosedAt: closedAtBase ? new Date(closedAtBase.getTime() + int(5, 90) * 60000) : null,
          note: random() < 0.2 ? `Notiz ${int(1, 999)} - Lieferung pruefen` : null,
          lines: {
            create: lines
          }
        }
      });

      createdDrafts += 1;
    }
  }

  return createdDrafts;
}

async function main() {
  const customerCount = Number.parseInt(process.env.SEED_CUSTOMER_COUNT ?? "220", 10);
  const productCount = Number.parseInt(process.env.SEED_PRODUCT_COUNT ?? "140", 10);

  console.log(`[seed-realistic] Start: customers=${customerCount}, products=${productCount}`);
  await ensureAdminUser();
  await wipeBusinessData();

  const products = await seedProducts(productCount);
  const customers = await seedCustomers(customerCount);
  await seedCustomerPrices(customers, products);
  const createdDrafts = await seedDrafts(customers);

  const closedDrafts = await prisma.draft.count({ where: { tourClosedAt: { not: null } } });
  const openDrafts = await prisma.draft.count({ where: { tourClosedAt: null } });
  const prices = await prisma.customerPrice.count();

  console.log("[seed-realistic] Fertig");
  console.log(`[seed-realistic] customers=${customers.length}, products=${products.length}`);
  console.log(`[seed-realistic] customerPrices=${prices}`);
  console.log(`[seed-realistic] drafts=${createdDrafts}, closed=${closedDrafts}, open=${openDrafts}`);
}

main()
  .catch((error) => {
    console.error("[seed-realistic] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
