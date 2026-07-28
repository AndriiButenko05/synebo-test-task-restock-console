import { LIST_SKELETON_ROWS } from "@/lib/constants";

const ROWS = Array.from({ length: LIST_SKELETON_ROWS });

export default function Loading() {
  return (
    <div className="mx-auto max-w-350 px-4 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="h-5 w-28 rounded-sm bg-line" />
        <div className="h-7 w-56 rounded-sm bg-line" />
        <div className="h-7 w-48 rounded-sm bg-line" />
        <div className="h-7 w-48 rounded-sm bg-line" />
      </div>

      <div className="border border-line-strong">
        <div className="h-7.5 border-b border-line-strong bg-brand-tint" />
        {ROWS.map((_, index) => (
          <div
            key={index}
            className="flex h-10 items-center gap-3 border-b border-line px-3"
          >
            <div className="h-8 w-8 shrink-0 rounded-sm bg-line" />
            <div className="h-3 w-64 rounded-sm bg-line" />
            <div className="h-3 w-32 rounded-sm bg-line" />
            <div className="ml-auto h-3 w-16 rounded-sm bg-line" />
            <div className="h-3 w-12 rounded-sm bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
