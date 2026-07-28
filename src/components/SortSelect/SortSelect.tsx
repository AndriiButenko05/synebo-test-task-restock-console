"use client";

import { SELECT_CHEVRON, SELECT_FIELD, SORT_OPTIONS } from "@/lib/constants";
import type { Sort, SortSelectProps } from "@/types/types";

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative flex flex-1 items-center md:hidden">
      <label htmlFor="sort-order" className="sr-only">
        Sort order
      </label>
      <select
        id="sort-order"
        key={value}
        defaultValue={value}
        onChange={(event) => onChange(event.target.value as Sort)}
        className={`${SELECT_FIELD} w-full`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 10 6"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={SELECT_CHEVRON}
      >
        <path d="M1 1l4 4 4-4" />
      </svg>
    </div>
  );
}
