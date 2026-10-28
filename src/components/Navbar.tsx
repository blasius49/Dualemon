"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { IconCart, IconPhone, IconPin, IconUser, IconX } from "./Icons";
import { OpenBadge } from "./OpenBadge";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/avaliacoes", label: "Avaliações" },
  { href: "/conta", label: "Minha conta" },
];

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden items-center justify-between gap-4 border-b border-line bg-panel px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] text-dim sm:flex">
        <span className="inline-flex items-center gap-2">
          <IconPin className="h-3.5 w-3.5 text-brand-gold" />
          R. Pres. Costa e Silva, 546 · Testo Rega, Pomerode-SC
        </span>
        <span className="inline-flex items-center gap-5">
          <OpenBadge />
          <a href="tel:+5547991749651" className="inline-flex items-center gap-2 transition hover:text-brand-gold">
            <IconPhone className="h-3.5 w-3.5 text-brand-gold" />
            (47) 99174-9651
          </a>
        </span>
      </div>

      <div className="border-b border-line bg-coal/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" aria-label="Dualemon — início">
            <Logo markClass="h-10 w-10" wordClass="text-xl sm:text-2xl" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative font-display text-sm font-semibold uppercase tracking-[0.18em] transition ${
                  pathname === l.href ? "text-brand-gold" : "text-cream hover:text-brand-gold"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-brand-gold transition-all duration-300 ${
                    pathname === l.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/conta"
              className="hidden h-10 w-10 place-items-center border border-line text-dim transition hover:border-brand-gold hover:text-brand-gold md:grid"
              aria-label="Área do cliente"
            >
              <IconUser className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center border border-line text-cream transition hover:border-brand-gold hover:text-brand-gold"
              aria-label="Abrir carrinho"
            >
              <IconCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand-gold px-1 font-display text-[11px] font-bold text-coal">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center border border-line text-cream md:hidden"
              aria-label="Abrir menu"
            >
              {mobileOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="rise-in border-t border-line bg-panel px-4 py-4 md:hidden">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 font-display text-base font-semibold uppercase tracking-[0.16em] ${
                      pathname === l.href ? "bg-coal text-brand-gold" : "text-cream hover:bg-coal"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="px-3 pt-2">
                <OpenBadge />
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
