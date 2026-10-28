"use client";

import { useCallback, useEffect, useState } from "react";
import type { Me, Review, ReviewStats } from "@/lib/types";
import { Stars, StarPicker } from "@/components/Stars";
import { Reveal } from "@/components/Reveal";
import { IconGoogle, IconCheck } from "@/components/Icons";
import { formatDate } from "@/lib/format";

const MAPS_REVIEWS =
  "https://www.google.com/maps/search/?api=1&query=Dualemon+Hamburgueria+Pomerode+SC";

export default function AvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data: { reviews: Review[]; stats: ReviewStats }) => {
        setReviews(data.reviews);
        setStats(data.stats);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    load();
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => m && setMe(m as Me))
      .catch(() => {});
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text, authorName: author }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível publicar.");
        return;
      }
      setText("");
      setSent(true);
      load();
    } catch {
      setError("Falha de conexão.");
    } finally {
      setBusy(false);
    }
  }

  const maxDist = Math.max(1, ...(stats?.distribution ?? [1]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
          Avaliações
        </p>
        <h1 className="display-tight mt-3 text-5xl font-bold sm:text-6xl">
          A nota que a <span className="text-brand-gold">freguesia</span> dá
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Painel de estatísticas */}
        <Reveal className="border border-line bg-panel p-7">
          {stats && (
            <>
              <div className="flex items-end gap-5">
                <p className="display-tight text-7xl font-bold text-brand-gold">
                  {stats.average ? stats.average.toFixed(1).replace(".", ",") : "—"}
                </p>
                <div className="pb-2">
                  <Stars value={stats.average} className="h-5 w-5" />
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-dim">
                    {stats.count} avaliações publicadas
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const qty = stats.distribution[star - 1] ?? 0;
                  return (
                    <li key={star} className="flex items-center gap-3 text-xs text-dim">
                      <span className="w-8 font-display font-semibold text-cream">{star} ★</span>
                      <span className="h-2 flex-1 bg-coal">
                        <span
                          className="block h-full bg-brand-gold transition-all duration-1000"
                          style={{ width: `${(qty / maxDist) * 100}%` }}
                        />
                      </span>
                      <span className="w-6 text-right">{qty}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <div className="mt-7 flex items-center gap-4 border-t border-line pt-6">
            <IconGoogle className="h-6 w-6" />
            <div className="flex-1">
              <p className="font-display text-sm font-semibold uppercase tracking-wide">
                4,3 · 125 avaliações no Google
              </p>
              <p className="text-xs text-dim">Perfil verificado da casa no Google Maps</p>
            </div>
            <a
              href={MAPS_REVIEWS}
              target="_blank"
              rel="noreferrer"
              className="border border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-dim transition hover:border-brand-gold hover:text-brand-gold"
            >
              Ver no Google
            </a>
          </div>
        </Reveal>

        {/* Formulário */}
        <Reveal delay={100}>
          <form onSubmit={submit} className="flex h-full flex-col gap-4 border border-line bg-panel p-7">
            <h2 className="display-tight text-2xl font-semibold">Conte como foi sua visita</h2>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">
                Sua nota
              </p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            {!me && (
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">
                  Seu nome
                </span>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Como quer aparecer"
                  className="input-base"
                />
              </label>
            )}
            <label className="flex flex-1 flex-col">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">
                Comentário
              </span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="O que você pediu? O que surpreendeu? A casa agradece o feedback honesto."
                className="input-base flex-1 resize-none"
              />
            </label>
            {error && (
              <p className="border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
                {error}
              </p>
            )}
            {sent && !error && (
              <p className="inline-flex items-center gap-2 border border-brand-gold/50 bg-brand-gold/10 px-3 py-2 text-sm text-brand-gold">
                <IconCheck className="h-4 w-4" />
                Avaliação publicada. Danke schön!
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="bg-brand-gold py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream disabled:opacity-50"
            >
              {busy ? "Publicando…" : "Publicar avaliação"}
            </button>
            {me && (
              <p className="text-center text-[11px] text-dim">
                Publicando como <strong className="text-cream">{me.name}</strong> ·{" "}
                <a href="/conta" className="text-brand-gold underline-offset-2 hover:underline">
                  área do cliente
                </a>
              </p>
            )}
          </form>
        </Reveal>
      </div>

      {/* Lista */}
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {!loaded
          ? [0, 1, 2].map((i) => <div key={i} className="h-56 animate-pulse border border-line bg-panel" />)
          : reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 80}>
                <blockquote className="flex h-full flex-col border border-line bg-panel p-6 transition hover:-translate-y-1 hover:border-brand-gold/60">
                  <div className="flex items-center justify-between">
                    <Stars value={r.rating} />
                    {r.source === "google" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-dim">
                        <IconGoogle className="h-3.5 w-3.5" /> Google
                      </span>
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.14em] text-dim">Site</span>
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
    </div>
  );
}
