import type {
  AvailabilityStatus,
  ProductsTableColumn,
  SortOption,
} from "@/types/types";

export const API_BASE_URL = "https://dummyjson.com";

export const API_TIMEOUT_MS = 10000;

export const PRODUCT_FIELDS = [
  "id",
  "title",
  "brand",
  "sku",
  "category",
  "price",
  "stock",
  "availabilityStatus",
  "thumbnail",
].join(",");

export const PAGE_SIZE = 30;

export const DEBOUNCE_MS = 350;

export const LOW_STOCK: AvailabilityStatus = "Low Stock";
export const OUT_OF_STOCK: AvailabilityStatus = "Out of Stock";

export const ORDER_STORAGE_KEY = "restock-console:order";

export const ORDER_EVENT = "restock-console:order-changed";

export const SORT_OPTIONS: SortOption[] = [
  { value: "", label: "Default order" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "stock-asc", label: "Stock, low to high" },
  { value: "stock-desc", label: "Stock, high to low" },
];

export const PRODUCT_COLUMNS: ProductsTableColumn[] = [
  { label: "Image", className: "" },
  { label: "Name", className: "" },
  { label: "Brand", className: "" },
  { label: "Category", className: "" },
  { label: "Unit price", className: "md:text-right", sortKey: "price" },
  { label: "In stock", className: "md:text-right", sortKey: "stock" },
];

export const ROW_GRID =
  "grid-cols-[56px_minmax(0,1fr)] " +
  "md:grid-cols-[56px_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_7rem_8rem]";

export const ROW_CELL =
  "col-span-2 flex items-baseline justify-between gap-4 px-3 py-0.5 " +
  "before:text-[11px] before:uppercase before:tracking-wide before:text-muted " +
  "before:content-[attr(data-label)] " +
  "md:col-span-1 md:block md:py-1.5 md:before:content-none";

export const PAGINATION_CONTROL =
  "inline-flex h-7 min-w-7 items-center justify-center rounded-sm border px-2 text-[12px] tabular-nums";

export const PAGINATION_LINK = `${PAGINATION_CONTROL} border-line-strong bg-white text-ink hover:border-brand hover:text-brand`;

export const PAGINATION_DISABLED = `${PAGINATION_CONTROL} border-line bg-white text-muted`;

export const SELECT_FIELD =
  "h-7 appearance-none rounded-sm border border-line-strong bg-white pl-2 pr-6 text-[13px] text-ink focus:border-brand focus:outline-none";

export const SELECT_CHEVRON =
  "pointer-events-none absolute right-2 top-1/2 h-1.5 w-2.5 -translate-y-1/2 stroke-muted";

export const SECTION_HEADER = "mb-2 flex min-h-7 flex-wrap items-center gap-3";

export const SECTION_TITLE =
  "text-[11px] font-semibold uppercase tracking-wide text-muted";

const TOGGLE = "h-7 rounded-sm border px-2 text-[12px]";

export const TOGGLE_ACTIVE = `${TOGGLE} border-brand bg-brand font-semibold text-white`;

export const TOGGLE_IDLE = `${TOGGLE} border-line-strong bg-white text-ink hover:border-brand hover:text-brand`;

export const LIST_SKELETON_ROWS = 15;

export const DETAIL_SKELETON_FIELDS = 5;

export const DETAIL_SKELETON_REVIEWS = 4;
