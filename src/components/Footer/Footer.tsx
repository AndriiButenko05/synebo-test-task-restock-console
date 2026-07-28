export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-350 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-[11px] text-muted">
        <span>Restock Console — internal procurement tool</span>
        <span>
          Built by <span className="text-ink">Andrii Butenko</span> · Stock data
          from{" "}
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-dark hover:underline"
          >
            dummyjson.com
          </a>
        </span>
      </div>
    </footer>
  );
}
