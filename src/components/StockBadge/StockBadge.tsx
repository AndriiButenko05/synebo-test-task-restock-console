import { LOW_STOCK, OUT_OF_STOCK } from "@/lib/constants";
import type { StockBadgeProps } from "@/types/types";

export default function StockBadge({ status }: StockBadgeProps) {
  if (status === LOW_STOCK) {
    return (
      <span
        title="Low Stock"
        className="rounded-sm border border-accent bg-accent-tint px-1 py-px text-[10px] font-semibold uppercase tracking-wide text-ink"
      >
        Low
      </span>
    );
  }

  if (status === OUT_OF_STOCK) {
    return (
      <span
        title="Out of Stock"
        className="rounded-sm border border-danger/30 bg-danger/10 px-1 py-px text-[10px] font-semibold uppercase tracking-wide text-danger"
      >
        Out
      </span>
    );
  }

  return null;
}
