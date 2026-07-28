"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/SearchInput/SearchInput";
import CategorySelect from "@/components/CategorySelect/CategorySelect";
import SortSelect from "@/components/SortSelect/SortSelect";
import ProductsTable from "@/components/ProductsTable/ProductsTable";
import Pagination from "@/components/Pagination/Pagination";
import { LOW_STOCK, PAGE_SIZE } from "@/lib/constants";
import {
  buildListHref,
  buildProductHref,
  nextSort,
} from "@/lib/functions/functions";
import type {
  ListSearchParams,
  ProductsClientProps,
  Sort,
  SortKey,
} from "@/types/types";

export default function ProductsClient({
  products,
  total,
  categories,
  q,
  category,
  page,
  sort,
}: ProductsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const current: ListSearchParams = { q, category, page, sort };

  function hrefWith(next: Partial<ListSearchParams>): string {
    return buildListHref({ ...current, ...next });
  }

  function handleSearch(nextQuery: string) {
    startTransition(() => {
      router.replace(hrefWith({ q: nextQuery, page: 1 }), { scroll: false });
    });
  }

  function handleCategory(nextCategory: string) {
    startTransition(() => {
      router.push(hrefWith({ category: nextCategory, page: 1 }), {
        scroll: false,
      });
    });
  }

  function handleSort(value: Sort) {
    startTransition(() => {
      router.push(hrefWith({ sort: value, page: 1 }), { scroll: false });
    });
  }

  const categoryLabels = Object.fromEntries(
    categories.map((entry) => [entry.slug, entry.name]),
  );
  const lowStockCount = products.filter(
    (product) => product.availabilityStatus === LOW_STOCK,
  ).length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const firstOnPage = (page - 1) * PAGE_SIZE + 1;
  const lastOnPage = (page - 1) * PAGE_SIZE + products.length;

  return (
    <div className="mx-auto max-w-350 px-4 py-3">
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
        <div className="flex items-center justify-between gap-2 md:contents">
          <h1 className="text-[15px] font-semibold text-ink md:mr-2">
            Working list
          </h1>
          <span className="text-[12px] tabular-nums text-muted md:order-last md:ml-auto">
            {products.length > 0
              ? `${firstOnPage}–${lastOnPage} of ${total}`
              : `0 of ${total}`}
          </span>
        </div>

        <SearchInput value={q} onSearch={handleSearch} />

        <div className="flex gap-2 md:contents">
          <CategorySelect
            value={category}
            categories={categories}
            onChange={handleCategory}
          />
          <SortSelect value={sort} onChange={handleSort} />
        </div>

        <span
          className={`inline-flex h-7 items-center gap-1.5 self-start rounded-sm border px-2 text-[12px] ${
            lowStockCount > 0
              ? "border-accent bg-accent-tint text-ink"
              : "border-line bg-white text-muted"
          }`}
        >
          <span className="font-semibold tabular-nums">{lowStockCount}</span>
          <span>running out on this page</span>
        </span>
      </div>

      <div
        aria-busy={isPending}
        className={`border border-line-strong ${isPending ? "opacity-60" : ""}`}
      >
        {products.length > 0 ? (
          <ProductsTable
            products={products}
            categoryLabels={categoryLabels}
            productHref={(id) => buildProductHref(id, current)}
            sort={sort}
            sortHref={(key: SortKey) =>
              hrefWith({ sort: nextSort(sort, key), page: 1 })
            }
          />
        ) : (
          <p className="px-3 py-8 text-center text-[13px] text-muted">
            {total > 0
              ? "This page is past the end of the results."
              : "No products match the current search and category."}
          </p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="text-[12px] tabular-nums text-muted">
          Page {page} of {totalPages}
        </span>
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(target) => hrefWith({ page: target })}
        />
      </div>
    </div>
  );
}
