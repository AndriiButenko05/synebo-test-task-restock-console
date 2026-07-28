"use client";

import Link from "next/link";
import { useOrder } from "@/app/providers";

export default function Header() {
  const { count, ready, resetOrder } = useOrder();

  return (
    <header className="border-b border-line-strong bg-white">
      <div className="mx-auto flex h-12 max-w-350 items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-[19px] font-semibold tracking-tight text-ink"
        >
          Restock<span className="text-brand">Console</span>
        </Link>

        <div className="flex items-center gap-2 text-[12px] text-muted">
          <span>On order</span>
          <span
            aria-live="polite"
            className="min-w-7 rounded-sm border border-brand-border bg-brand-tint px-2 py-0.5 text-center font-semibold tabular-nums text-brand-dark"
          >
            {ready ? count : " "}
          </span>
          {ready && count > 0 && (
            <button
              type="button"
              onClick={resetOrder}
              aria-label="Clear the order"
              className="h-6 rounded-sm border border-line px-1.5 text-[11px] text-muted hover:border-danger hover:text-danger"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
