"use client";

import { useEffect, useState } from "react";
import { openState } from "@/lib/format";

export function OpenBadge({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    setState(openState(new Date()));
    const t = setInterval(() => setState(openState(new Date())), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2 w-2">
        {state?.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            state ? (state.open ? "bg-brand-gold" : "bg-brand-red") : "bg-dim"
          }`}
        />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
        {state ? state.label : "Consultando horário…"}
      </span>
    </span>
  );
}
