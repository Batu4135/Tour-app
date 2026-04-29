export const CUSTOMER_PRICE_CLIPBOARD_KEY = "customer-price-clipboard";

export type CopiedCustomerPriceItem = {
  productId: number;
  productName: string;
  priceCents: number;
};

export type CustomerPriceClipboardPayload = {
  type: "customer-price-clipboard";
  sourceCustomerId: number;
  sourceCustomerName: string;
  copiedAt: string;
  items: CopiedCustomerPriceItem[];
};

function isCopiedCustomerPriceItem(value: unknown): value is CopiedCustomerPriceItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "number" &&
    Number.isFinite(item.productId) &&
    typeof item.productName === "string" &&
    typeof item.priceCents === "number" &&
    Number.isFinite(item.priceCents)
  );
}

export function isCustomerPriceClipboardPayload(value: unknown): value is CustomerPriceClipboardPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    payload.type === "customer-price-clipboard" &&
    typeof payload.sourceCustomerId === "number" &&
    Number.isFinite(payload.sourceCustomerId) &&
    typeof payload.sourceCustomerName === "string" &&
    typeof payload.copiedAt === "string" &&
    Array.isArray(payload.items) &&
    payload.items.every(isCopiedCustomerPriceItem)
  );
}

export async function saveCustomerPriceClipboard(payload: CustomerPriceClipboardPayload) {
  const serialized = JSON.stringify(payload);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(CUSTOMER_PRICE_CLIPBOARD_KEY, serialized);
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(serialized);
    } catch {
      // Local storage remains the primary in-app fallback.
    }
  }
}

export async function loadCustomerPriceClipboard(): Promise<CustomerPriceClipboardPayload | null> {
  if (typeof window !== "undefined") {
    const localValue = window.localStorage.getItem(CUSTOMER_PRICE_CLIPBOARD_KEY);
    if (localValue) {
      try {
        const parsed = JSON.parse(localValue);
        if (isCustomerPriceClipboardPayload(parsed)) return parsed;
      } catch {
        // Ignore malformed local state and continue to clipboard fallback.
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) return null;
      const parsed = JSON.parse(clipboardText);
      if (isCustomerPriceClipboardPayload(parsed)) return parsed;
    } catch {
      return null;
    }
  }

  return null;
}
