import Link from "next/link";
import {
  PAGINATION_CONTROL,
  PAGINATION_DISABLED,
  PAGINATION_LINK,
} from "@/lib/constants";
import { paginationWindow } from "@/lib/functions/functions";
import type { PaginationProps } from "@/types/types";

export default function Pagination({
  page,
  totalPages,
  buildHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      {page <= 1 ? (
        <span aria-disabled="true" className={PAGINATION_DISABLED}>
          Previous
        </span>
      ) : (
        <Link href={buildHref(page - 1)} rel="prev" className={PAGINATION_LINK}>
          Previous
        </Link>
      )}

      {paginationWindow(page, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1 text-[12px] text-muted"
          >
            …
          </span>
        ) : entry === page ? (
          <span
            key={entry}
            aria-current="page"
            className={`${PAGINATION_CONTROL} border-brand bg-brand font-semibold text-white`}
          >
            {entry}
          </span>
        ) : (
          <Link key={entry} href={buildHref(entry)} className={PAGINATION_LINK}>
            {entry}
          </Link>
        ),
      )}

      {page >= totalPages ? (
        <span aria-disabled="true" className={PAGINATION_DISABLED}>
          Next
        </span>
      ) : (
        <Link href={buildHref(page + 1)} rel="next" className={PAGINATION_LINK}>
          Next
        </Link>
      )}
    </nav>
  );
}
