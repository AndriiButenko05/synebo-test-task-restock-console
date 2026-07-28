import axios from "axios";
import {
  API_BASE_URL,
  API_TIMEOUT_MS,
  PAGE_SIZE,
  PRODUCT_FIELDS,
} from "@/lib/constants";
import type {
  Category,
  ListSearchParams,
  Product,
  ProductsPage,
  ProductsResponse,
  Sort,
} from "@/types/types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

function failed(what: string): Error {
  return new Error(`Could not load ${what} from the supplier API.`);
}

function sortParams(sort: Sort) {
  if (!sort) return {};
  const [sortBy, order] = sort.split("-");
  return { sortBy, order };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<Category[]>("/products/categories");
    return data;
  } catch {
    throw failed("the category list");
  }
}

export async function getProducts({
  q,
  category,
  page,
  sort,
}: ListSearchParams): Promise<ProductsPage> {
  const skip = (page - 1) * PAGE_SIZE;

  try {
    if (q && category) {
      const { data } = await apiClient.get<ProductsResponse>(
        `/products/category/${encodeURIComponent(category)}`,
        {
          params: { limit: 0, select: PRODUCT_FIELDS, ...sortParams(sort) },
        },
      );
      const needle = q.toLowerCase();
      const matched = data.products.filter((product) =>
        product.title.toLowerCase().includes(needle),
      );
      return {
        products: matched.slice(skip, skip + PAGE_SIZE),
        total: matched.length,
      };
    }

    const path = q
      ? "/products/search"
      : category
        ? `/products/category/${encodeURIComponent(category)}`
        : "/products";

    const { data } = await apiClient.get<ProductsResponse>(path, {
      params: {
        limit: PAGE_SIZE,
        skip,
        select: PRODUCT_FIELDS,
        ...sortParams(sort),
        ...(q ? { q } : {}),
      },
    });

    return { products: data.products, total: data.total };
  } catch {
    throw failed("the product list");
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<Product>(
      `/products/${encodeURIComponent(id)}`,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw failed("the product");
  }
}
