import { LOW_STOCK, OUT_OF_STOCK, SORT_OPTIONS } from "@/lib/constants";
import type {
  AvailabilityStatus,
  Dimensions,
  ListSearchParams,
  OrderLines,
  Review,
  ReviewOrder,
  Sort,
  SortKey,
} from "@/types/types";

export function parseSort(value: string | null | undefined): Sort {
  return SORT_OPTIONS.some((option) => option.value === value)
    ? (value as Sort)
    : "";
}

export function parsePage(value: string | null | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function buildListQuery(params: ListSearchParams): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.sort) query.set("sort", params.sort);
  if (params.page > 1) query.set("page", String(params.page));
  return query.toString();
}

export function buildListHref(params: ListSearchParams): string {
  const query = buildListQuery(params);
  return query ? `/?${query}` : "/";
}

export function buildProductHref(id: number, params: ListSearchParams): string {
  const query = buildListQuery(params);
  return query
    ? `/product/${id}?from=${encodeURIComponent(query)}`
    : `/product/${id}`;
}

export function buildBackHref(from: string | undefined): string {
  if (!from) return "/";

  const source = new URLSearchParams(from);
  return buildListHref({
    q: source.get("q")?.trim() ?? "",
    category: source.get("category") ?? "",
    sort: parseSort(source.get("sort")),
    page: parsePage(source.get("page")),
  });
}

export function nextSort(current: Sort, key: SortKey): Sort {
  if (current === `${key}-asc`) return `${key}-desc`;
  if (current === `${key}-desc`) return "";
  return `${key}-asc`;
}

export function sortAriaValue(sort: Sort, key: SortKey | undefined) {
  if (!key) return undefined;
  if (sort === `${key}-asc`) return "ascending" as const;
  if (sort === `${key}-desc`) return "descending" as const;
  return "none" as const;
}

export function sortMarker(sort: Sort, key: SortKey): string {
  if (sort === `${key}-asc`) return "↑";
  if (sort === `${key}-desc`) return "↓";
  return "↕";
}

export function stockRowClassName(status: AvailabilityStatus): string {
  if (status === LOW_STOCK) return "bg-accent-tint text-body";
  if (status === OUT_OF_STOCK) return "bg-line text-muted";
  return "bg-white text-body";
}

export function paginationWindow(
  page: number,
  totalPages: number,
): (number | "gap")[] {
  const wanted = [1, totalPages, page - 1, page, page + 1];
  const visible = [...new Set(wanted)]
    .filter((candidate) => candidate >= 1 && candidate <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  visible.forEach((candidate, index) => {
    if (index > 0 && candidate - visible[index - 1] > 1) {
      result.push("gap");
    }
    result.push(candidate);
  });
  return result;
}

export function parseOrderLines(raw: string | null): OrderLines {
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    const lines: OrderLines = {};
    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key);
      if (
        Number.isInteger(id) &&
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0
      ) {
        lines[id] = value;
      }
    }
    return lines;
  } catch {
    return {};
  }
}

export function countOrderLines(lines: OrderLines): number {
  return Object.values(lines).reduce((sum, quantity) => sum + quantity, 0);
}

export function averageRating(reviews: Review[]): number {
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

export function sortReviews(reviews: Review[], order: ReviewOrder): Review[] {
  const newestFirst = reviews
    .map((review, index) => ({ review, index }))
    .sort((a, b) => {
      const difference =
        new Date(b.review.date).getTime() - new Date(a.review.date).getTime();
      return difference !== 0 ? difference : a.index - b.index;
    })
    .map((entry) => entry.review);

  return order === "newest" ? newestFirst : newestFirst.reverse();
}

export function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatCategory(slug: string): string {
  return slug.replace(/-/g, " ");
}

export function formatDimensions({ width, height, depth }: Dimensions): string {
  return `${width} × ${height} × ${depth} cm`;
}
