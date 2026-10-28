"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { brl } from "@/lib/format";
import { useCart } from "./CartProvider";
import { IconCheck, IconPlus } from "./Icons";
import { LogoMark } from "./Logo";

export function ProductCard({ product }: { product: Product }) {
  const { add, qtyOf } = useCart();
  const [flash, setFlash] = useState(false);
  const qty = qtyOf(product.id);

  function handleAdd() {
    add(product);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 900);
  }

  return (
    <article className="group relative flex flex-col overflow-hidden border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/70 hover:shadow-[0_18px_40px_-18px_rgba(255,206,0,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-coal">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#1c1c1f,#0b0b0c_70%)]">
            <LogoMark className="h-20 w-20 opacity-25 transition-transform duration-700 group-hover:scale-110" />
          </div>
        )}
        {product.tag && (
          <span className="absolute left-0 top-3 bg-brand-gold px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-coal">
            {product.tag}
          </span>
        )}
        {qty > 0 && (
          <span className="absolute right-3 top-3 grid h-7 min-w-7 place-items-center rounded-full border border-brand-gold bg-coal/90 px-2 font-display text-xs font-bold text-brand-gold">
            {qty}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="display-tight text-xl font-semibold">{product.name}</h3>
        <p className="mt-1.5 clamp-2 flex-1 text-sm leading-relaxed text-dim">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-xl font-semibold text-brand-gold">{brl(product.priceCents)}</span>
          <button
            onClick={handleAdd}
            className={`inline-flex h-10 items-center gap-2 px-4 font-display text-xs font-bold uppercase tracking-[0.18em] transition-all ${
              flash
                ? "bg-brand-gold text-coal"
                : "bg-cream text-coal hover:bg-brand-gold"
            }`}
            aria-label={`Adicionar ${product.name} ao pedido`}
          >
            {flash ? <IconCheck className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
            {flash ? "Adicionado" : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
