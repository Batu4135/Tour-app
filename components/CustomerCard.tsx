"use client";

import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";

type CustomerCardProps = {
  customer: {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    routeDay: string | null;
  };
};

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Link
      href={`/customers/${customer.id}`}
      className="card touch-target flex items-center justify-between gap-4 transition-all hover:border-[#2F7EA1]/30"
    >
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-[#4A4A4A]">{customer.name}</p>
        {customer.address ? <p className="mt-1 truncate text-sm text-[#4A4A4A]/75">{customer.address}</p> : null}
        {customer.phone ? (
          <p className="mt-1 flex items-center gap-1 text-sm text-[#4A4A4A]/65">
            <Phone size={14} />
            {customer.phone}
          </p>
        ) : null}
      </div>
      <ChevronRight className="shrink-0 text-[#4A4A4A]/60" size={18} />
    </Link>
  );
}
