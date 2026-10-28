import { useId } from "react";

/**
 * Recriação vetorial da marca Dualemon:
 * anel externo fino + disco com as cores da Alemanha +
 * salsicha bratwurst espetada num garfo de dois dentes.
 */
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="none" stroke="#f4efe6" strokeWidth="3" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#f4efe6" strokeWidth="10" />
      <clipPath id={`disc-${id}`}>
        <circle cx="100" cy="100" r="72" />
      </clipPath>
      <g clipPath={`url(#disc-${id})`}>
        <rect x="26" y="26" width="148" height="49.5" fill="#0b0b0c" />
        <rect x="26" y="75.5" width="148" height="49.5" fill="#d8232a" />
        <rect x="26" y="125" width="148" height="49.5" fill="#ffce00" />
      </g>
      <path d="M88 98 L88 54 L91 36 L94 54 L94 98 Z" fill="#f4efe6" />
      <path d="M106 98 L106 54 L109 36 L112 54 L112 98 Z" fill="#f4efe6" />
      <rect x="96" y="92" width="8" height="56" fill="#f4efe6" />
      <rect x="91" y="140" width="18" height="30" rx="4" fill="#f4efe6" />
      <path d="M40 92 Q100 58 160 92" stroke="#f4efe6" strokeWidth="24" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({
  markClass = "h-11 w-11",
  wordClass = "text-2xl",
  withWord = true,
}: {
  markClass?: string;
  wordClass?: string;
  withWord?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark className={markClass} />
      {withWord && (
        <span className={`display-tight font-semibold border-b-[3px] border-cream pb-0.5 ${wordClass}`}>
          Dualemon
        </span>
      )}
    </span>
  );
}
