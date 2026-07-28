import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api/api";
import { buildBackHref } from "@/lib/functions/functions";
import type { ProductPageProps } from "@/types/types";
import ProductClient from "./Product.client";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = `${product.brand ?? "Unbranded"} · SKU ${product.sku}`;

  return {
    title: product.title,
    description,
    openGraph: {
      title: `${product.title} | Restock Console`,
      description,
      url: `/product/${product.id}`,
    },
  };
}

export default async function Page({ params, searchParams }: ProductPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} backHref={buildBackHref(from)} />;
}
