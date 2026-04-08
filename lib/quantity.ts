const QUANTITY_DECIMAL_PRECISION = 2;
const QUANTITY_SCALE = 10 ** QUANTITY_DECIMAL_PRECISION;

export function roundQuantity(value: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.round(Math.max(0, value) * QUANTITY_SCALE) / QUANTITY_SCALE;
}

export function parseQuantityInput(value: string): number | null {
  const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return 0;
  if (normalized === "." || normalized === "-") return null;

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return null;
  return roundQuantity(parsed);
}

export function isQuantityInputAllowed(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return true;
  return /^\d+(?:\.\d{0,2})?$/.test(normalized);
}

export function formatQuantity(value: number): string {
  const safe = roundQuantity(value);
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: QUANTITY_DECIMAL_PRECISION
  }).format(safe);
}

export function multiplyCentsByQuantity(quantity: number, cents: number): number {
  const safeQuantity = roundQuantity(quantity);
  const safeCents =
    typeof cents === "number" && Number.isFinite(cents) ? Math.max(0, Math.round(cents)) : 0;
  return Math.round(safeQuantity * safeCents);
}
