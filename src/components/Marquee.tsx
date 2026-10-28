export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-display text-sm font-semibold uppercase tracking-[0.22em]">{item}</span>
          <svg viewBox="0 0 24 24" className="h-3 w-3 opacity-70" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`overflow-hidden border-y border-coal/20 ${className}`}>
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
