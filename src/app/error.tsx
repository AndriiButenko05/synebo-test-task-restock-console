"use client";

import type { ErrorPageProps } from "@/types/types";

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto max-w-350 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-sm border border-danger/30 bg-danger/5 p-4 text-center">
        <h1 className="text-[15px] font-semibold text-ink">
          Could not load stock data
        </h1>
        <p className="mt-1 text-[13px] text-body">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 inline-flex h-7 items-center rounded-sm border border-brand bg-brand px-3 text-[12px] font-semibold text-white hover:bg-brand-dark"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
