import Link from "next/link";
import { Logo } from "./Logo";
import { IconInstagram, IconPhone, IconPin } from "./Icons";
import { WEEK_HOURS } from "@/lib/format";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo markClass="h-14 w-14" wordClass="text-3xl" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-dim">
            Hamburgueria artesanal de Pomerode: blend fresco moído na casa, bratwurst de receita
            pomerana e chope colonial gelado. Do jeito alemão, sem pressa e sem atalho.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border border-line px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-cream transition hover:border-brand-gold hover:text-brand-gold"
          >
            <IconInstagram className="h-4 w-4" />
            @dualemon
          </a>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Navegação
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-dim">
            <li><Link className="transition hover:text-cream" href="/cardapio">Cardápio completo</Link></li>
            <li><Link className="transition hover:text-cream" href="/avaliacoes">Avaliações</Link></li>
            <li><Link className="transition hover:text-cream" href="/conta">Área do cliente</Link></li>
            <li><Link className="transition hover:text-cream" href="/admin">Área administrativa</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Onde & quando
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-dim">
            <li className="flex gap-2">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <span>R. Pres. Costa e Silva, 546<br />Testo Rega, Pomerode - SC, 89107-000</span>
            </li>
            <li className="flex gap-2">
              <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
              <a href="tel:+5547991749651" className="transition hover:text-cream">(47) 99174-9651</a>
            </li>
          </ul>
          <ul className="mt-4 space-y-1 text-xs text-dim">
            {WEEK_HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-6">
                <span>{h.day}</span>
                <span className={h.open === null ? "text-brand-red" : "text-cream"}>
                  {h.open === null
                    ? "fechado"
                    : `${String(h.open).padStart(2, "0")}:00 – ${String(h.close).padStart(2, "0")}:00`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-dim sm:flex-row">
          <span>© {new Date().getFullYear()} Dualemon Hamburgueria · Pomerode-SC</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-6 bg-coal" />
            <span className="h-2 w-6 bg-brand-red" />
            <span className="h-2 w-6 bg-brand-gold" />
          </span>
        </div>
      </div>
    </footer>
  );
}
