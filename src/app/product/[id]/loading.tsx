import {
  DETAIL_SKELETON_FIELDS,
  DETAIL_SKELETON_REVIEWS,
} from "@/lib/constants";

const FIELDS = Array.from({ length: DETAIL_SKELETON_FIELDS });
const REVIEWS = Array.from({ length: DETAIL_SKELETON_REVIEWS });

export default function Loading() {
  return (
    <div className="mx-auto max-w-350 px-4 py-3">
      <div className="h-4 w-40 rounded-sm bg-line" />

      <div className="mt-2 grid gap-4 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className="aspect-square w-full rounded-sm border border-line-strong bg-line" />

        <div>
          <div className="h-6 w-96 max-w-full rounded-sm bg-line" />
          <div className="mt-2 h-3 w-64 rounded-sm bg-line" />
          <div className="mt-3 h-3 w-full max-w-2xl rounded-sm bg-line" />
          <div className="mt-1.5 h-3 w-full max-w-xl rounded-sm bg-line" />
          <div className="mt-3 h-14 border-y border-line-strong" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="border border-line-strong">
          {FIELDS.map((_, index) => (
            <div key={index} className="h-8 border-b border-line last:border-b-0" />
          ))}
        </div>
        <div className="border border-line-strong">
          {REVIEWS.map((_, index) => (
            <div key={index} className="h-14 border-b border-line last:border-b-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
