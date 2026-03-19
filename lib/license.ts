export const LICENSE_TYPES = ["NONE", "LP", "LK", "LA", "LV"] as const;

export type LicenseType = (typeof LICENSE_TYPES)[number];

export type LicenseProductLike = {
  licenseFeeCents?: number | null;
  licenseType?: string | null;
  licenseWeightGrams?: number | null;
};

export type LicenseDetails = {
  licenseType: LicenseType;
  licenseWeightGrams: number;
  rateCentsPerKg: number;
  unitFeeCents: number;
  hasLicense: boolean;
};

export type LicenseWeightSummary = {
  licenseType: Exclude<LicenseType, "NONE">;
  totalWeightGrams: number;
  totalFeeCents: number;
};

const LICENSE_RATE_CENTS_PER_KG: Record<LicenseType, number> = {
  NONE: 0,
  LP: 25,
  LK: 99,
  LA: 99,
  LV: 99
};

function toSafeInt(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function isKnownLicenseType(value: string): value is LicenseType {
  return (LICENSE_TYPES as readonly string[]).includes(value);
}

export function normalizeLicenseType(value: string | null | undefined): LicenseType {
  if (!value) return "NONE";
  const normalized = value.trim().toUpperCase();
  if (isKnownLicenseType(normalized)) return normalized;
  return "NONE";
}

export function resolveLicenseRateCentsPerKg(type: LicenseType): number {
  return LICENSE_RATE_CENTS_PER_KG[type] ?? 0;
}

export function buildLicensePersistence(input: LicenseProductLike): {
  licenseType: LicenseType;
  licenseWeightGrams: number;
  licenseFeeCents: number;
} {
  const explicitFeeCents = toSafeInt(input.licenseFeeCents);
  let licenseType = normalizeLicenseType(input.licenseType);
  let licenseWeightGrams = toSafeInt(input.licenseWeightGrams);

  if (licenseType === "NONE" || licenseWeightGrams <= 0) {
    return {
      licenseType: "NONE",
      licenseWeightGrams: 0,
      licenseFeeCents: 0
    };
  }

  const rate = resolveLicenseRateCentsPerKg(licenseType);
  const calculatedFeeCents = explicitFeeCents > 0 ? explicitFeeCents : Math.round((licenseWeightGrams * rate) / 1000);

  return {
    licenseType,
    licenseWeightGrams,
    licenseFeeCents: Math.max(0, calculatedFeeCents)
  };
}

export function getLicenseDetails(input: LicenseProductLike): LicenseDetails {
  const persisted = buildLicensePersistence(input);
  const rateCentsPerKg = resolveLicenseRateCentsPerKg(persisted.licenseType);
  const hasLicense = persisted.licenseType !== "NONE" && persisted.licenseWeightGrams > 0;

  return {
    licenseType: persisted.licenseType,
    licenseWeightGrams: persisted.licenseWeightGrams,
    rateCentsPerKg,
    unitFeeCents: persisted.licenseFeeCents,
    hasLicense
  };
}

export function getLineLicenseTotals(quantity: number, input: LicenseProductLike): {
  details: LicenseDetails;
  lineWeightGrams: number;
  lineFeeCents: number;
} {
  const safeQuantity = Math.max(0, Math.round(quantity));
  const details = getLicenseDetails(input);
  return {
    details,
    lineWeightGrams: details.licenseWeightGrams * safeQuantity,
    lineFeeCents: details.unitFeeCents * safeQuantity
  };
}

export function summarizeLicenseByType<T extends { quantity: number }>(
  lines: T[],
  getProduct: (line: T) => LicenseProductLike
): LicenseWeightSummary[] {
  const totals = new Map<Exclude<LicenseType, "NONE">, { totalWeightGrams: number; totalFeeCents: number }>();

  for (const line of lines) {
    const { details, lineWeightGrams, lineFeeCents } = getLineLicenseTotals(line.quantity, getProduct(line));
    if (!details.hasLicense || details.licenseType === "NONE") continue;

    const current = totals.get(details.licenseType) ?? { totalWeightGrams: 0, totalFeeCents: 0 };
    current.totalWeightGrams += lineWeightGrams;
    current.totalFeeCents += lineFeeCents;
    totals.set(details.licenseType, current);
  }

  return [...totals.entries()]
    .map(([licenseType, aggregate]) => ({
      licenseType,
      totalWeightGrams: aggregate.totalWeightGrams,
      totalFeeCents: aggregate.totalFeeCents
    }))
    .sort((a, b) => a.licenseType.localeCompare(b.licenseType));
}
