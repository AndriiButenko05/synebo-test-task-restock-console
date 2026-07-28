"use client";

import { useEffect, useRef } from "react";
import { DEBOUNCE_MS } from "@/lib/constants";
import type { SearchInputProps } from "@/types/types";

export default function SearchInput({ value, onSearch }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSent = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === lastSent.current) return;
    lastSent.current = value;
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value.trim();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (next === lastSent.current) return;
      lastSent.current = next;
      onSearch(next);
    }, DEBOUNCE_MS);
  }

  return (
    <div className="flex min-w-0 items-center md:flex-none">
      <label htmlFor="product-search" className="sr-only">
        Search products by name
      </label>
      <input
        id="product-search"
        ref={inputRef}
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder="Search by name…"
        autoComplete="off"
        className="h-7 w-full min-w-0 rounded-sm border border-line-strong bg-white px-2 text-[13px] text-ink placeholder:text-muted focus:border-brand focus:outline-none md:w-56"
      />
    </div>
  );
}
