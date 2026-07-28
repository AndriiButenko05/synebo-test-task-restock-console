import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/api/api";
import { parsePage, parseSort } from "@/lib/functions/functions";
import type { ListPageProps } from "@/types/types";
import ProductsClient from "./Products.client";

export const metadata: Metadata = {
  title: "Working List",
  description: "Track stock levels and estimate restocking cost.",
  openGraph: {
    title: "Working List | Restock Console",
    description: "Track stock levels and estimate restocking cost.",
    url: "/",
  },
};

export default async function Page({ searchParams }: ListPageProps) {
  const { q = "", category = "", page, sort } = await searchParams;

  const trimmedQuery = q.trim();
  const currentPage = parsePage(page);
  const currentSort = parseSort(sort);

  const categories = await getCategories();
  const knownCategory = categories.some((entry) => entry.slug === category)
    ? category
    : "";

  const { products, total } = await getProducts({
    q: trimmedQuery,
    category: knownCategory,
    page: currentPage,
    sort: currentSort,
  });

  return (
    <ProductsClient
      products={products}
      total={total}
      categories={categories}
      q={trimmedQuery}
      category={knownCategory}
      page={currentPage}
      sort={currentSort}
    />
  );
}
