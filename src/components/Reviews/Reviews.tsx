"use client";

import { useState } from "react";
import {
  SECTION_HEADER,
  SECTION_TITLE,
  TOGGLE_ACTIVE,
  TOGGLE_IDLE,
} from "@/lib/constants";
import {
  averageRating,
  formatDate,
  sortReviews,
} from "@/lib/functions/functions";
import type { ReviewOrder, ReviewsProps } from "@/types/types";

export default function Reviews({ reviews }: ReviewsProps) {
  const [order, setOrder] = useState<ReviewOrder>("newest");

  if (reviews.length === 0) {
    return (
      <section>
        <div className={SECTION_HEADER}>
          <h2 className={SECTION_TITLE}>Reviews</h2>
          <span className="text-[13px] text-muted">No rating yet</span>
        </div>
        <p className="border border-line-strong px-3 py-8 text-center text-[13px] text-muted">
          No reviews for this item yet.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className={SECTION_HEADER}>
        <h2 className={SECTION_TITLE}>Reviews</h2>
        <span className="text-[13px] text-ink">
          <span className="font-semibold tabular-nums">
            {averageRating(reviews).toFixed(2)}
          </span>
          <span className="text-muted"> / 5 from {reviews.length} reviews</span>
        </span>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOrder("newest")}
            aria-pressed={order === "newest"}
            className={order === "newest" ? TOGGLE_ACTIVE : TOGGLE_IDLE}
          >
            Newest first
          </button>
          <button
            type="button"
            onClick={() => setOrder("oldest")}
            aria-pressed={order === "oldest"}
            className={order === "oldest" ? TOGGLE_ACTIVE : TOGGLE_IDLE}
          >
            Oldest first
          </button>
        </div>
      </div>

      <ul className="border border-line-strong">
        {sortReviews(reviews, order).map((review) => (
          <li
            key={`${review.reviewerEmail}-${review.date}`}
            className="border-b border-line px-3 py-2 last:border-b-0"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-ink">
                {review.reviewerName}
              </span>
              <span className="tabular-nums text-muted">
                {formatDate(review.date)}
              </span>
              <span className="ml-auto font-semibold tabular-nums text-ink">
                {review.rating}/5
              </span>
            </div>
            <p className="mt-0.5 text-body">{review.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
