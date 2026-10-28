import { IconStar } from "./Icons";

export function Stars({ value, className = "h-4 w-4" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex" aria-label={`${value.toFixed(1)} de 5 estrelas`}>
      <span className="flex gap-0.5 text-line">
        {[0, 1, 2, 3, 4].map((i) => (
          <IconStar key={i} className={className} />
        ))}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <span className="flex gap-0.5 text-brand-gold">
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStar key={i} className={className} />
          ))}
        </span>
      </span>
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} estrela${i > 1 ? "s" : ""}`}
          className={`transition-transform hover:scale-125 ${i <= value ? "text-brand-gold" : "text-line"}`}
        >
          <IconStar className="h-7 w-7" />
        </button>
      ))}
    </div>
  );
}
