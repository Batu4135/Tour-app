import { getLineLicenseTotals } from "@/lib/license";

const VAT_RATE = 0.19;

type DraftTotalsLine = {
  quantity: number;
  unitPriceCents: number;
  product?: unknown;
};

type DraftTotalsInput = {
  lines: DraftTotalsLine[];
  includeLicenseFee?: boolean | null;
  discountCents?: number | null;
  subtractVat?: boolean | null;
};

function normalizeCents(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

export function calculateDraftTotals(input: DraftTotalsInput) {
  const productSubtotalCents = input.lines.reduce(
    (sum, line) => sum + Math.max(0, line.quantity) * normalizeCents(line.unitPriceCents),
    0
  );

  const licenseTotalCents = input.lines.reduce((sum, line) => {
    const { lineFeeCents } = getLineLicenseTotals(Math.max(0, line.quantity), line.product ?? {});
    return sum + lineFeeCents;
  }, 0);

  const subtotalCents =
    productSubtotalCents + (input.includeLicenseFee ? licenseTotalCents : 0);
  const requestedDiscountCents = 0;
  const discountAppliedCents = 0;
  const afterDiscountCents = Math.max(0, subtotalCents - discountAppliedCents);
  const vatCents = input.subtractVat ? 0 : Math.round(afterDiscountCents * VAT_RATE);
  const totalCents = afterDiscountCents;
  const invoiceTotalCents = afterDiscountCents + vatCents;

  return {
    productSubtotalCents,
    licenseTotalCents,
    subtotalCents,
    requestedDiscountCents,
    discountAppliedCents,
    afterDiscountCents,
    vatCents,
    totalCents,
    invoiceTotalCents
  };
}
