export const LICENSE_MATERIAL_CODES = ["LP", "LK", "LA", "LV"] as const;

export type LicenseMaterialCode = (typeof LICENSE_MATERIAL_CODES)[number];

export const LICENSE_RATE_CENTS_PER_KG: Record<LicenseMaterialCode, number> = {
  LP: 25,
  LK: 99,
  LA: 99,
  LV: 99
};

export function isLicenseMaterialCode(value: unknown): value is LicenseMaterialCode {
  return typeof value === "string" && (LICENSE_MATERIAL_CODES as readonly string[]).includes(value.toUpperCase());
}

export function normalizeLicenseMaterial(value: unknown): LicenseMaterialCode | null {
  if (typeof value !== "string") return null;
  const upper = value.trim().toUpperCase();
  return isLicenseMaterialCode(upper) ? upper : null;
}

export function normalizeLicenseWeightGrams(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

export function computeLicenseFeeCents(
  material: LicenseMaterialCode | null | undefined,
  weightGrams: number | null | undefined
): number {
  const normalizedMaterial = normalizeLicenseMaterial(material);
  if (!normalizedMaterial) return 0;

  const grams = normalizeLicenseWeightGrams(weightGrams);
  if (grams <= 0) return 0;

  const rate = LICENSE_RATE_CENTS_PER_KG[normalizedMaterial];
  return Math.max(0, Math.round((grams / 1000) * rate));
}

export function formatKgFromGrams(weightGrams: number): string {
  const kg = normalizeLicenseWeightGrams(weightGrams) / 1000;
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(kg);
}
