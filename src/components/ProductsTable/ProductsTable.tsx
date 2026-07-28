import Image from "next/image";
import Link from "next/link";
import StockBadge from "@/components/StockBadge/StockBadge";
import { PRODUCT_COLUMNS, ROW_CELL, ROW_GRID } from "@/lib/constants";
import {
  formatCategory,
  formatPrice,
  sortAriaValue,
  sortMarker,
  stockRowClassName,
} from "@/lib/functions/functions";
import type { ProductsTableProps } from "@/types/types";

export default function ProductsTable({
  products,
  categoryLabels,
  productHref,
  sort,
  sortHref,
}: ProductsTableProps) {
  return (
    <ul role="table" aria-label="Products" className="text-[13px]">
      <li
        role="row"
        className={`hidden border-b border-line-strong bg-brand-tint md:grid md:items-center ${ROW_GRID}`}
      >
        {PRODUCT_COLUMNS.map((column) => (
          <span
            key={column.label}
            role="columnheader"
            aria-sort={sortAriaValue(sort, column.sortKey)}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted ${column.className}`}
          >
            {column.sortKey ? (
              <Link
                href={sortHref(column.sortKey)}
                scroll={false}
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                {column.label}
                <span aria-hidden="true">
                  {sortMarker(sort, column.sortKey)}
                </span>
              </Link>
            ) : (
              column.label
            )}
          </span>
        ))}
      </li>

      {products.map((product) => (
        <li
          key={product.id}
          role="row"
          className={`grid items-start border-b border-line py-1 md:items-center md:py-0 ${ROW_GRID} ${stockRowClassName(
            product.availabilityStatus,
          )}`}
        >
          <span role="cell" className="px-3 py-1.5 md:py-0.5">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={32}
              height={32}
              className="h-8 w-8 max-w-none rounded-sm object-cover"
            />
          </span>

          <span role="cell" className="block px-3 py-1 md:py-1.5">
            <Link
              href={productHref(product.id)}
              className="font-medium leading-tight text-ink hover:text-brand hover:underline"
            >
              {product.title}
            </Link>
            <span className="block text-[11px] leading-tight text-muted">
              {product.sku}
            </span>
          </span>

          <span role="cell" className={ROW_CELL} data-label="Brand">
            {product.brand ?? "—"}
          </span>

          <span
            role="cell"
            className={`${ROW_CELL} capitalize`}
            data-label="Category"
          >
            {categoryLabels[product.category] ??
              formatCategory(product.category)}
          </span>

          <span
            role="cell"
            className={`${ROW_CELL} tabular-nums md:text-right`}
            data-label="Unit price"
          >
            {formatPrice(product.price)}
          </span>

          <span
            role="cell"
            className={`${ROW_CELL} tabular-nums md:text-right`}
            data-label="In stock"
          >
            <span className="inline-flex items-center justify-end gap-1.5">
              <StockBadge status={product.availabilityStatus} />
              <span className="font-semibold">{product.stock}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
