import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-350 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-sm border border-line-strong p-4 text-center">
        <h1 className="text-[15px] font-semibold text-ink">Product not found</h1>
        <p className="mt-1 text-[13px] text-body">
          This item is not in the supplier catalogue. It may have been delisted.
        </p>
        <Link
          href="/"
          className="mt-3 inline-flex h-7 items-center rounded-sm border border-brand bg-brand px-3 text-[12px] font-semibold text-white hover:bg-brand-dark"
        >
          Back to the working list
        </Link>
      </div>
    </div>
  );
}
