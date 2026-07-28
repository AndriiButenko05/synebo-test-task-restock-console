"use client";

import Link from "next/link";
import Gallery from "@/components/Gallery/Gallery";
import Reviews from "@/components/Reviews/Reviews";
import StockBadge from "@/components/StockBadge/StockBadge";
import { useOrder } from "@/app/providers";
import { OUT_OF_STOCK, SECTION_HEADER, SECTION_TITLE } from "@/lib/constants";
import {
  formatCategory,
  formatDimensions,
  formatPrice,
} from "@/lib/functions/functions";
import type { FieldProps, ProductClientProps } from "@/types/types";

function Field({ label, value }: FieldProps) {
  return (
    <div className="flex justify-between gap-4 border-b border-line px-3 py-1.5 last:border-b-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

export default function ProductClient({
  product,
  backHref,
}: ProductClientProps) {
  const { lines, ready, addToOrder } = useOrder();

  const ordered = lines[product.id] ?? 0;
  const outOfStock = product.availabilityStatus === OUT_OF_STOCK;
  const atLimit = ordered >= product.stock;
  const disabled = !ready || outOfStock || atLimit;

  const orderStatus = outOfStock
    ? "Out of stock — cannot be ordered"
    : atLimit
      ? `All ${product.stock} units on order`
      : ordered > 0
        ? `${ordered} of ${product.stock} on order`
        : "";

  return (
    <div className="mx-auto max-w-350 px-4 py-3">
      <Link
        href={backHref}
        className="text-[12px] text-brand hover:text-brand-dark hover:underline"
      >
        ← Back to the working list
      </Link>

      <div className="mt-2 grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        <Gallery
          images={
            product.images.length > 0 ? product.images : [product.thumbnail]
          }
          title={product.title}
        />

        <div>
          <h1 className="text-[20px] font-semibold leading-tight text-ink">
            {product.title}
          </h1>
          <p className="mt-0.5 text-[12px] text-muted">
            {product.brand ?? "—"} · SKU {product.sku} ·{" "}
            <span className="capitalize">
              {formatCategory(product.category)}
            </span>
          </p>

          <p className="mt-2 max-w-2xl text-body">{product.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-6 border-y border-line-strong py-2">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted">
                Unit price
              </div>
              <div className="text-[18px] font-semibold tabular-nums text-ink">
                {formatPrice(product.price)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted">
                In stock
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-semibold tabular-nums text-ink">
                  {product.stock}
                </span>
                <StockBadge status={product.availabilityStatus} />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[12px] text-muted">{orderStatus}</span>
              <button
                type="button"
                onClick={() => addToOrder(product.id, product.stock)}
                disabled={disabled}
                title={disabled ? orderStatus : undefined}
                className={`inline-flex h-8 items-center rounded-sm border px-3 text-[13px] font-semibold ${
                  disabled
                    ? "cursor-not-allowed border-line bg-line text-muted"
                    : "border-brand bg-brand text-white hover:bg-brand-dark"
                }`}
              >
                Add to order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section>
          <div className={SECTION_HEADER}>
            <h2 className={SECTION_TITLE}>Logistics</h2>
          </div>
          <dl className="border border-line-strong">
            <Field label="Weight" value={`${product.weight} kg`} />
            <Field
              label="Dimensions"
              value={formatDimensions(product.dimensions)}
            />
            <Field label="Shipping" value={product.shippingInformation} />
            <Field label="Return policy" value={product.returnPolicy} />
            <Field label="Warranty" value={product.warrantyInformation} />
          </dl>
        </section>

        <Reviews reviews={product.reviews} />
      </div>
    </div>
  );
}
