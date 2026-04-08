"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { centsToEuro } from "@/lib/money";
import { formatQuantity, multiplyCentsByQuantity } from "@/lib/quantity";

type DraftLineItemProps = {
  line: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPriceCents: number;
  };
  onIncrease: (lineId: number) => void;
  onDecrease: (lineId: number) => void;
  onDelete: (lineId: number) => void;
};

export default function DraftLineItem({ line, onIncrease, onDecrease, onDelete }: DraftLineItemProps) {
  return (
    <div className="card flex items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{line.productName}</p>
        <p className="text-xs text-[#4A4A4A]/70">
          {centsToEuro(line.unitPriceCents)} x {formatQuantity(line.quantity)}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#2F7EA1]">
          {centsToEuro(multiplyCentsByQuantity(line.quantity, line.unitPriceCents))}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" className="secondary-btn !p-2" onClick={() => onDecrease(line.id)} aria-label="Minus">
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-sm font-semibold">{formatQuantity(line.quantity)}</span>
        <button type="button" className="secondary-btn !p-2" onClick={() => onIncrease(line.id)} aria-label="Plus">
          <Plus size={16} />
        </button>
        <button
          type="button"
          className="danger-btn !p-2"
          onClick={() => onDelete(line.id)}
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
