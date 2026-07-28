import type { ReactNode } from "react";

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Dimensions = {
  width: number;
  height: number;
  depth: number;
};

export type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type Product = {
  id: number;
  title: string;
  brand?: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  availabilityStatus: AvailabilityStatus;
  thumbnail: string;
  images: string[];
  description: string;
  weight: number;
  dimensions: Dimensions;
  shippingInformation: string;
  returnPolicy: string;
  warrantyInformation: string;
  reviews: Review[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductsPage = {
  products: Product[];
  total: number;
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

export type SortKey = "price" | "stock";

export type SortOrder = "asc" | "desc";

export type Sort = `${SortKey}-${SortOrder}` | "";

export type SortOption = {
  value: Sort;
  label: string;
};

export type ReviewOrder = "newest" | "oldest";

export type ListSearchParams = {
  q: string;
  category: string;
  page: number;
  sort: Sort;
};

export type ListPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    sort?: string;
  }>;
};

export type ProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export type ProductsClientProps = ListSearchParams & {
  products: Product[];
  total: number;
  categories: Category[];
};

export type ProductClientProps = {
  product: Product;
  backHref: string;
};

export type SearchInputProps = {
  value: string;
  onSearch: (q: string) => void;
};

export type CategorySelectProps = {
  value: string;
  categories: Category[];
  onChange: (slug: string) => void;
};

export type SortSelectProps = {
  value: Sort;
  onChange: (sort: Sort) => void;
};

export type ProductsTableColumn = {
  label: string;
  className: string;
  sortKey?: SortKey;
};

export type ProductsTableProps = {
  products: Product[];
  categoryLabels: Record<string, string>;
  productHref: (id: number) => string;
  sort: Sort;
  sortHref: (key: SortKey) => string;
};

export type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export type StockBadgeProps = {
  status: AvailabilityStatus;
};

export type ReviewsProps = {
  reviews: Review[];
};

export type GalleryProps = {
  images: string[];
  title: string;
};

export type FieldProps = {
  label: string;
  value: string;
};

export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type ProvidersProps = {
  children: ReactNode;
};

export type OrderLines = Record<number, number>;

export type OrderContextValue = {
  lines: OrderLines;
  count: number;
  ready: boolean;
  addToOrder: (productId: number, stock: number) => void;
  resetOrder: () => void;
};
