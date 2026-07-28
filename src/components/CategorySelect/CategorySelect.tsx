"use client";

import { useEffect, useRef } from "react";
import { SELECT_CHEVRON, SELECT_FIELD } from "@/lib/constants";
import type { CategorySelectProps } from "@/types/types";

export default function CategorySelect({
  value,
  categories,
  onChange,
}: CategorySelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const lastSent = useRef(value);

  useEffect(() => {
    if (value === lastSent.current) return;
    lastSent.current = value;
    if (selectRef.current) {
      selectRef.current.value = value;
    }
  }, [value]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const slug = event.target.value;
    lastSent.current = slug;
    onChange(slug);
  }

  return (
    <div className="relative flex flex-1 items-center md:flex-none">
      <label htmlFor="category-filter" className="sr-only">
        Filter by category
      </label>
      <select
        id="category-filter"
        ref={selectRef}
        defaultValue={value}
        onChange={handleChange}
        className={`${SELECT_FIELD} w-full md:w-48`}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
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
