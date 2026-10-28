import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { Stars } from "@/components/Stars";
import { OpenBadge } from "@/components/OpenBadge";
import { ProductCard } from "@/components/ProductCard";
import { LogoMark } from "@/components/Logo";
import {
  IconArrow,
  IconClock,
  IconFlame,
  IconFork,
  IconGoogle,
  IconInstagram,
  IconPhone,
  IconPin,
} from "@/components/Icons";
import { formatDate } from "@/lib/format";
import type { Product, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Dualemon+R.+Pres.+Costa+e+Silva+546+Pomerode+SC";

export default async function Home() {
  const featuredRows = await db.select().from(products).where(eq(products.featured, true)).limit(8);
  const featured: Product[] = featuredRows.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }));

  const reviewRows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.approved, true))
    .orderBy(desc(reviews.createdAt))
    .limit(3);
  const highlights: Review[] = reviewRows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 85% 10%, rgba(255,206,0,0.10), transparent 60%), radial-gradient(40rem 24rem at 10% 90%, rgba(216,35,42,0.12), transparent 60%)",
          }}
        />
        <span className="outline-word pointer-events-none absolute -right-6 top-24 hidden select-none font-display text-[9rem] font-bold leading-none [writing-mode:vertical-rl] xl:block">
          Pomerode
        </span>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
          <div className="relative">
            <Reveal>
              <p className="inline-flex items-center gap-3 border border-line bg-panel px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dim">
                <LogoMark className="h-5 w-5" />
                Hamburgueria · Pomerode-SC
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display-tight mt-6 text-5xl font-bold sm:text-7xl lg:text-[5.2rem]">
                Hambúrguer
                <br />
                artesanal com
                <br />
                <span className="text-brand-gold">sotaque alemão</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-dim">
                Blend fresco moído na casa, bratwurst de receita pomerana, pão pretzel e chope
                colonial gelado. Tudo na chapa, do jeito que a colônia gosta — na R. Pres. Costa e
                Silva, 546, Testo Rega.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/cardapio"
                  className="group inline-flex items-center gap-3 bg-brand-gold px-7 py-3.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream"
                >
                  Ver cardápio
                  <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+5547991749651"
                  className="inline-flex items-center gap-3 border border-line px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-cream transition hover:border-brand-gold hover:text-brand-gold"
                >
                  <IconPhone className="h-4 w-4" />
                  (47) 99174-9651
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 text-sm text-dim">
                <span className="inline-flex items-center gap-2">
                  <Stars value={4.3} />
                  <strong className="font-display text-lg text-cream">4,3</strong>
                  <IconGoogle className="h-4 w-4" />
                  125 avaliações no Google
                </span>
                <span className="hidden h-4 w-px bg-line sm:block" />
                <span className="uppercase tracking-[0.16em]">R$ 40–100 por pessoa</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160} className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -left-3 -top-3 h-16 w-16 border-l-2 border-t-2 border-brand-gold" />
              <div className="absolute -bottom-3 -right-3 h-16 w-16 border-b-2 border-r-2 border-brand-gold" />
              <div className="relative aspect-[4/5] overflow-hidden border border-line">
                <img
                  src="https://images.pexels.com/photos/36741809/pexels-photo-36741809.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Cliente segurando um cheeseburger Dualemon sob luz de neon"
                  className="h-full w-full animate-kenburns object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="border border-line bg-coal/85 px-4 py-3 backdrop-blur">
                    <OpenBadge />
                  </div>
                  <LogoMark className="h-12 w-12 animate-spin-slow opacity-90" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        className="bg-brand-gold py-3 text-coal"
        items={[
          "Smash burgers",
          "Bratwurst artesanal",
          "Chope colonial",
          "Apfelstrudel",
          "Pomerode · SC",
          "Blend moído na casa",
        ]}
      />

      {/* ============ DESTAQUES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Direto da chapa
            </p>
            <h2 className="display-tight mt-2 text-4xl font-bold sm:text-5xl">
              Os queridos <span className="outline-word">da casa</span>
            </h2>
          </div>
          <Link
            href="/cardapio"
            className="group inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-dim transition hover:text-brand-gold"
          >
            Cardápio completo
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ HISTÓRIA (sticky 2 colunas) ============ */}
      <section className="border-y border-line bg-panel">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Feito em Pomerode
              </p>
              <h2 className="display-tight mt-2 text-4xl font-bold sm:text-6xl">
                Do jeito pomerano:
                <br />
                sem pressa e
                <br />
                <span className="gold-underline">sem atalho</span>
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-dim">
                A Dualemon nasceu no Testo Rega da mistura mais honesta que existe: a tradição
                alemã de Pomerode e a chapa alta de uma hamburgueria de bairro. Moemos o blend
                todo dia, defumamos o bacon aqui e buscamos o chope a poucos quilômetros dali.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line">
                {[
                  { k: "4,3", v: "nota no Google" },
                  { k: "125", v: "avaliações públicas" },
                  { k: "R$ 40–100", v: "ticket por pessoa" },
                  { k: "100%", v: "blend moído na casa" },
                ].map((s) => (
                  <div key={s.v} className="bg-panel p-5">
                    <p className="display-tight text-3xl font-bold text-brand-gold">{s.k}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-dim">{s.v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <Reveal>
              <figure className="group overflow-hidden border border-line">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/24245659/pexels-photo-24245659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Cozinha da Dualemon finalizando um burger"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex items-center gap-3 border-t border-line bg-coal px-4 py-3 text-sm text-dim">
                  <IconFlame className="h-4 w-4 text-brand-gold" />
                  Chapa a 220°C: selagem rápida, miolo suculento.
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={80}>
              <div className="border border-line bg-coal p-6">
                <h3 className="display-tight text-2xl font-semibold">Herança pomerana</h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">
                  O chucrute é fermentado aqui dentro, a mostarda escura leva mel de flor de
                  laranjeira e o pão pretzel vem de uma padaria colonial da estrada velha. Cada
                  ingrediente carrega um pedaço da cidade mais alemã do Brasil.
                </p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <figure className="group overflow-hidden border border-line">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/5530256/pexels-photo-5530256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                    alt="Chope colonial servido no balcão da Dualemon"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex items-center gap-3 border-t border-line bg-coal px-4 py-3 text-sm text-dim">
                  <IconFork className="h-4 w-4 text-brand-gold" />
                  Duas torneiras fixas: colonial lager e IPA da casa.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ AVALIAÇÕES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Quem provou, recomenda
            </p>
            <h2 className="display-tight mt-2 text-4xl font-bold sm:text-5xl">A voz da freguesia</h2>
          </div>
          <Link
            href="/avaliacoes"
            className="group inline-flex items-center gap-2 border border-line px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-brand-gold hover:text-brand-gold"
          >
            Ver todas & avaliar
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {highlights.map((r, i) => (
            <Reveal key={r.id} delay={i * 90}>
              <blockquote className="flex h-full flex-col border border-line bg-panel p-6 transition hover:border-brand-gold/60">
                <div className="flex items-center justify-between">
                  <Stars value={r.rating} />
                  {r.source === "google" ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-dim">
                      <IconGoogle className="h-3.5 w-3.5" /> Google
                    </span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.14em] text-dim">Cliente Dualemon</span>
                  )}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/90">“{r.text}”</p>
                <footer className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-dim">
                  <span className="font-display text-sm font-semibold uppercase tracking-wider text-cream">
                    {r.authorName}
                  </span>
                  <span>{formatDate(r.createdAt)}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ VISITE ============ */}
      <section className="border-t border-line bg-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">Visite</p>
            <h2 className="display-tight mt-2 text-4xl font-bold sm:text-5xl">
              Testo Rega,
              <br />
              Pomerode-SC
            </h2>
            <ul className="mt-8 space-y-5 text-sm">
              <li className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line text-brand-gold">
                  <IconPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold uppercase tracking-wide">Endereço</p>
                  <p className="mt-1 text-dim">
                    R. Pres. Costa e Silva, 546 — Testo Rega
                    <br />
                    Pomerode - SC, 89107-000
                  </p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-brand-gold underline-offset-4 transition hover:underline"
                  >
                    Traçar rotas no Google Maps →
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line text-brand-gold">
                  <IconClock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold uppercase tracking-wide">Horários</p>
                  <p className="mt-1 text-dim">Ter a qui e dom · 18h–22h</p>
                  <p className="text-dim">Sex e sáb · 18h–23h · segunda fechado</p>
                  <OpenBadge className="mt-2 text-brand-gold" />
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line text-brand-gold">
                  <IconInstagram className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-semibold uppercase tracking-wide">Redes</p>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-dim transition hover:text-brand-gold"
                  >
                    @dualemon no Instagram — bastidores e novidades da filial Blumenau
                  </a>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full min-h-[380px] border border-line">
              <iframe
                title="Mapa — Dualemon Pomerode"
                src="https://maps.google.com/maps?q=R.%20Pres.%20Costa%20e%20Silva%2C%20546%20-%20Pomerode%20-%20SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-full min-h-[380px] w-full grayscale"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="bg-brand-gold text-coal">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row">
          <h2 className="display-tight text-center text-4xl font-bold sm:text-left sm:text-5xl">
            Bateu a fome?
            <br className="hidden sm:block" /> A chapa já está quente.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/cardapio"
              className="bg-coal px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-brand-gold transition hover:bg-panel"
            >
              Montar meu pedido
            </Link>
            <a
              href="tel:+5547991749651"
              className="border-2 border-coal px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-coal hover:text-brand-gold"
            >
              Ligar agora
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
