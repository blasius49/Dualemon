"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Me, Order } from "@/lib/types";
import { Logo, LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { IconBox, IconCheck, IconLogout, IconStar } from "@/components/Icons";
import { STATUS_FLOW, STATUS_LABEL, brl, formatDateTime } from "@/lib/format";

export default function ContaPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        setMe(m as Me | null);
        setLoading(false);
        if (m) {
          fetch("/api/orders")
            .then((r) => (r.ok ? r.json() : []))
            .then((o) => setOrders(o as Order[]))
            .catch(() => setOrders([]));
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(refresh, [refresh]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOrders([]);
    refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-32">
        <LogoMark className="h-14 w-14 animate-spin-slow opacity-60" />
      </div>
    );
  }

  if (!me) return <AuthPanel onDone={refresh} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Área do cliente
          </p>
          <h1 className="display-tight mt-3 text-5xl font-bold sm:text-6xl">Olá, {me.name.split(" ")[0]}</h1>
          <p className="mt-3 text-sm text-dim">{me.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/avaliacoes"
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-brand-gold hover:text-brand-gold"
          >
            <IconStar className="h-4 w-4" /> Avaliar a casa
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-dim transition hover:border-brand-red hover:text-brand-red"
          >
            <IconLogout className="h-4 w-4" /> Sair
          </button>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <h2 className="display-tight flex items-center gap-3 text-2xl font-semibold">
            <IconBox className="h-5 w-5 text-brand-gold" /> Meus pedidos
          </h2>
          {orders.length === 0 ? (
            <div className="mt-6 border border-line bg-panel p-10 text-center">
              <p className="text-sm text-dim">Você ainda não fez pedidos por aqui.</p>
              <Link
                href="/cardapio"
                className="mt-4 inline-block bg-brand-gold px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream"
              >
                Ver cardápio
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {orders.map((o, i) => (
                <Reveal key={o.id} delay={i * 60}>
                  <OrderCard order={o} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-5">
          <div className="border border-line bg-panel p-6">
            <Logo markClass="h-10 w-10" wordClass="text-xl" />
            <p className="mt-4 text-sm leading-relaxed text-dim">
              Acompanhe o status do seu pedido em tempo real: recebido → na chapa → pronto →
              entregue. Avisamos tudo por aqui.
            </p>
          </div>
          <div className="border border-line bg-panel p-6 text-sm">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Atalhos
            </h3>
            <ul className="mt-3 space-y-2 text-dim">
              <li><Link className="transition hover:text-cream" href="/cardapio">Fazer novo pedido</Link></li>
              <li><Link className="transition hover:text-cream" href="/avaliacoes">Deixar avaliação</Link></li>
              <li>
                <a className="transition hover:text-cream" href="tel:+5547991749651">
                  Falar com a casa: (47) 99174-9651
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const stepIndex = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
  const cancelled = order.status === "cancelled";

  return (
    <li className="border border-line bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold">
            Pedido <span className="text-brand-gold">#{order.id}</span>
          </p>
          <p className="text-xs text-dim">{formatDateTime(order.createdAt)} · {order.payment}</p>
        </div>
        <p className="font-display text-xl font-semibold text-brand-gold">{brl(order.totalCents)}</p>
      </div>

      {cancelled ? (
        <p className="mt-4 inline-block border border-brand-red/60 bg-brand-red/10 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
          Pedido cancelado
        </p>
      ) : (
        <ol className="mt-5 grid grid-cols-4 gap-2">
          {STATUS_FLOW.map((step, i) => {
            const done = i <= stepIndex;
            return (
              <li key={step} className="text-center">
                <span
                  className={`mx-auto block h-2.5 w-2.5 rotate-45 transition-colors ${
                    done ? "bg-brand-gold" : "bg-line"
                  }`}
                />
                <span
                  className={`mt-2 block text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    done ? "text-cream" : "text-dim"
                  }`}
                >
                  {STATUS_LABEL[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm text-dim">
        {order.items.map((it) => (
          <li key={it.productId} className="flex justify-between gap-4">
            <span>
              {it.qty}× {it.name}
            </span>
            <span>{brl(it.priceCents * it.qty)}</span>
          </li>
        ))}
      </ul>
      {order.note && (
        <p className="mt-3 border-l-2 border-brand-gold pl-3 text-xs italic text-dim">“{order.note}”</p>
      )}
      {order.status === "ready" && (
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-brand-gold">
          <IconCheck className="h-4 w-4" /> Pronto para retirada no balcão!
        </p>
      )}
    </li>
  );
}

function AuthPanel({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível continuar.");
        return;
      }
      onDone();
    } catch {
      setError("Falha de conexão.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 lg:py-24">
      <Reveal className="grid overflow-hidden border border-line md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-panel p-10 md:flex">
          <Logo markClass="h-16 w-16" wordClass="text-3xl" />
          <div>
            <h2 className="display-tight text-4xl font-bold leading-tight">
              Sua conta
              <br />
              <span className="text-brand-gold">Dualemon</span>
            </h2>
            <ul className="mt-6 space-y-2 text-sm text-dim">
              <li>· Acompanhe o status do pedido em tempo real</li>
              <li>· Histórico completo de compras</li>
              <li>· Avalie a casa com seu nome de cliente</li>
            </ul>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-dim">Pomerode · SC</p>
        </div>

        <form onSubmit={submit} className="space-y-4 bg-coal p-8 sm:p-10">
          <div className="flex border border-line">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`flex-1 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] transition ${
                  mode === m ? "bg-brand-gold text-coal" : "text-dim hover:text-cream"
                }`}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">Nome</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-base" placeholder="Seu nome" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="voce@email.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="••••••"
            />
          </label>

          {error && (
            <p className="border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand-gold py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream disabled:opacity-50"
          >
            {busy ? "Aguarde…" : mode === "login" ? "Entrar na conta" : "Criar minha conta"}
          </button>
          <p className="text-center text-[11px] text-dim">
            Dica: no carrinho também dá para pedir como convidado, sem criar conta.
          </p>
        </form>
      </Reveal>
    </div>
  );
}
