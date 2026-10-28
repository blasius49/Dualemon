"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuGroup } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { LogoMark } from "@/components/Logo";
import { IconFork } from "@/components/Icons";

export default function CardapioPage() {
  const [groups, setGroups] = useState<MenuGroup[] | null>(null);
  const [active, setActive] = useState<string>("todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: MenuGroup[]) => setGroups(data))
      .catch(() => setGroups([]));
  }, []);

  const filtered = useMemo(() => {
    if (!groups) return [];
    const q = query.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        products: g.products.filter(
          (p) =>
            (active === "todos" || g.slug === active) &&
            (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.products.length > 0);
  }, [groups, active, query]);

  const totalShown = filtered.reduce((acc, g) => acc + g.products.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
            <IconFork className="h-4 w-4" />
            Cardápio da casa
          </p>
          <h1 className="display-tight mt-3 text-5xl font-bold sm:text-6xl">
            A chapa de <span className="text-brand-gold">hoje</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-dim">
            Tudo é preparado no momento do pedido. Itens esgotados saem do cardápio
            automaticamente — o que você vê aqui, a cozinha tem na praça.
          </p>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar no cardápio…"
          className="input-base max-w-xs"
          aria-label="Buscar item do cardápio"
        />
      </Reveal>

      <div className="sticky top-[64px] z-30 -mx-4 mt-10 border-y border-line bg-coal/95 px-4 py-3 backdrop-blur sm:top-[64px]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterPill label="Todos" active={active === "todos"} onClick={() => setActive("todos")} />
          {(groups ?? []).map((g) => (
            <FilterPill
              key={g.slug}
              label={`${g.name} (${g.products.length})`}
              active={active === g.slug}
              onClick={() => setActive(g.slug)}
            />
          ))}
        </div>
      </div>

      {!groups ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-80 animate-pulse border border-line bg-panel" />
          ))}
        </div>
      ) : totalShown === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <LogoMark className="h-16 w-16 opacity-30" />
          <p className="text-sm text-dim">Nenhum item encontrado para esse filtro.</p>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          {filtered.map((g, gi) => (
            <section key={g.slug}>
              <Reveal className="flex items-baseline gap-4">
                <span className="font-display text-sm font-bold text-brand-gold">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <h2 className="display-tight text-3xl font-bold sm:text-4xl">{g.name}</h2>
                <span className="h-px flex-1 bg-line" />
              </Reveal>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {g.products.map((p, i) => (
                  <Reveal key={p.id} delay={i * 70}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 border px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] transition ${
        active
          ? "border-brand-gold bg-brand-gold text-coal"
          : "border-line text-dim hover:border-cream hover:text-cream"
      }`}
    >
      {label}
    </button>
  );
}
