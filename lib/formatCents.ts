export function formatCents(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  }).format(value / 100);
}

export function parseEuroToCents(value: string): number {
  const normalized = value.replace(/\s/g, "").replace(/\u20AC/g, "").replace(/\./g, "").replace(",", ".");
  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100);
}
