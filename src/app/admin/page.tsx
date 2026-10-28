"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Me, MenuGroup, Order, Review } from "@/lib/types";
import { Logo, LogoMark } from "@/components/Logo";
import { IconBox, IconChart, IconEdit, IconLogout, IconPlus, IconStar, IconTrash } from "@/components/Icons";
import { Stars } from "@/components/Stars";
import { STATUS_LABEL, brl, formatDateTime } from "@/lib/format";

type Stats = {
  ordersTotal: number;
  revenueTotal: number;
  ordersToday: number;
  revenueToday: number;
  inQueue: number;
  reviewAvg: number;
  reviewCount: number;
  productsActive: number;
};

type Tab = "resumo" | "pedidos" | "cardapio" | "avaliacoes";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "pedidos", label: "Pedidos" },
  { id: "cardapio", label: "Cardápio" },
  { id: "avaliacoes", label: "Avaliações" },
];

export default function AdminPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        setMe(m as Me | null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-32">
        <LogoMark className="h-14 w-14 animate-spin-slow opacity-60" />
      </div>
    );
  }

  if (!me || me.role !== "admin") return <AdminLogin onDone={() => window.location.reload()} />;

  return <Dashboard me={me} />;
}

/* ---------------- LOGIN ---------------- */

function AdminLogin({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciais inválidas.");
        return;
      }
      if (data.role !== "admin") {
        setError("Esta conta não tem perfil administrativo.");
        await fetch("/api/auth/logout", { method: "POST" });
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
    <div className="mx-auto flex max-w-md flex-col px-4 py-20">
      <div className="mb-8 text-center">
        <LogoMark className="mx-auto h-16 w-16" />
        <h1 className="display-tight mt-4 text-4xl font-bold">Painel da casa</h1>
        <p className="mt-2 text-sm text-dim">Acesso restrito à administração Dualemon</p>
      </div>
      <form onSubmit={submit} className="space-y-4 border border-line bg-panel p-7">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">E-mail</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" placeholder="admin@dualemon.com.br" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">Senha</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-base" placeholder="••••••••" />
        </label>
        {error && <p className="border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-sm text-brand-red">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand-gold py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream disabled:opacity-50"
        >
          {busy ? "Entrando…" : "Entrar no painel"}
        </button>
        <p className="border border-line bg-coal px-3 py-2 text-center text-[11px] text-dim">
          Demonstração: <strong className="text-cream">admin@dualemon.com.br</strong> · senha{" "}
          <strong className="text-cream">admin123</strong>
        </p>
        <p className="text-center text-[11px] text-dim">
          <Link href="/conta" className="text-brand-gold underline-offset-2 hover:underline">
            Sou cliente → área do cliente
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({ me }: { me: Me }) {
  const [tab, setTab] = useState<Tab>("resumo");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadStats = useCallback(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setStats(s as Stats))
      .catch(() => {});
  }, []);
  const loadOrders = useCallback(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((o) => setOrders(o as Order[]))
      .catch(() => {});
  }, []);
  const loadMenu = useCallback(() => {
    fetch("/api/products?all=1")
      .then((r) => r.json())
      .then((g) => setGroups(g as MenuGroup[]))
      .catch(() => {});
  }, []);
  const loadReviews = useCallback(() => {
    fetch("/api/reviews?all=1")
      .then((r) => r.json())
      .then((d) => setReviews((d.reviews ?? []) as Review[]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadStats();
    loadOrders();
    loadMenu();
    loadReviews();
  }, [loadStats, loadOrders, loadMenu, loadReviews]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Área administrativa
          </p>
          <h1 className="display-tight mt-2 text-4xl font-bold sm:text-5xl">Painel Dualemon</h1>
          <p className="mt-2 text-sm text-dim">Logado como {me.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="border border-line px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-dim transition hover:border-brand-gold hover:text-brand-gold"
          >
            Ver o site
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-dim transition hover:border-brand-red hover:text-brand-red"
          >
            <IconLogout className="h-4 w-4" /> Sair
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-line pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-5 py-3 font-display text-sm font-semibold uppercase tracking-[0.16em] transition ${
              tab === t.id
                ? "border-brand-gold text-brand-gold"
                : "border-transparent text-dim hover:text-cream"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "resumo" && <Resumo stats={stats} orders={orders} />}
        {tab === "pedidos" && (
          <Pedidos
            orders={orders}
            onChanged={() => {
              loadOrders();
              loadStats();
            }}
          />
        )}
        {tab === "cardapio" && (
          <CardapioAdmin
            groups={groups}
            onChanged={() => {
              loadMenu();
              loadStats();
            }}
          />
        )}
        {tab === "avaliacoes" && (
          <AvaliacoesAdmin
            reviews={reviews}
            onChanged={() => {
              loadReviews();
              loadStats();
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- RESUMO ---------------- */

function Resumo({ stats, orders }: { stats: Stats | null; orders: Order[] }) {
  const cards = [
    { label: "Pedidos hoje", value: stats ? String(stats.ordersToday) : "—" },
    { label: "Faturamento hoje", value: stats ? brl(stats.revenueToday) : "—" },
    { label: "Na fila da chapa", value: stats ? String(stats.inQueue) : "—" },
    { label: "Faturamento total", value: stats ? brl(stats.revenueTotal) : "—" },
    {
      label: "Nota da casa",
      value: stats ? stats.reviewAvg.toFixed(1).replace(".", ",") : "—",
      suffix: stats ? `(${stats.reviewCount} aval.)` : "",
    },
    { label: "Itens ativos", value: stats ? String(stats.productsActive) : "—" },
  ];
  return (
    <div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-panel p-5">
            <p className="display-tight text-3xl font-bold text-brand-gold">{c.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-dim">
              {c.label} {c.suffix ?? ""}
            </p>
          </div>
        ))}
      </div>

      <h2 className="display-tight mt-10 flex items-center gap-3 text-2xl font-semibold">
        <IconChart className="h-5 w-5 text-brand-gold" /> Últimos pedidos
      </h2>
      <ul className="mt-4 divide-y divide-line border border-line bg-panel">
        {orders.slice(0, 6).map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
            <span className="font-display font-semibold text-cream">#{o.id} · {o.customerName}</span>
            <span className="text-dim">{formatDateTime(o.createdAt)}</span>
            <StatusBadge status={o.status} />
            <span className="font-display font-semibold text-brand-gold">{brl(o.totalCents)}</span>
          </li>
        ))}
        {orders.length === 0 && <li className="px-5 py-6 text-sm text-dim">Nenhum pedido ainda.</li>}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const color =
    status === "cancelled"
      ? "border-brand-red/60 text-brand-red"
      : status === "delivered"
        ? "border-cream/40 text-cream"
        : "border-brand-gold/60 text-brand-gold";
  return (
    <span className={`border px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] ${color}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ---------------- PEDIDOS ---------------- */

function Pedidos({ orders, onChanged }: { orders: Order[]; onChanged: () => void }) {
  const [busyId, setBusyId] = useState<number | null>(null);

  async function change(id: number, status: string) {
    setBusyId(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    onChanged();
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <p className="border border-line bg-panel px-5 py-8 text-center text-sm text-dim">
          Nenhum pedido registrado até agora.
        </p>
      )}
      {orders.map((o) => (
        <article key={o.id} className="border border-line bg-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold">
                #{o.id} · {o.customerName}
                {o.phone && <span className="ml-2 text-sm font-normal text-dim">{o.phone}</span>}
              </p>
              <p className="text-xs text-dim">
                {formatDateTime(o.createdAt)} · {o.payment}
                {o.userId ? " · cliente cadastrado" : " · convidado"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-display text-xl font-semibold text-brand-gold">{brl(o.totalCents)}</p>
              <select
                value={o.status}
                disabled={busyId === o.id}
                onChange={(e) => change(o.id, e.target.value)}
                className="border border-line bg-coal px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-cream outline-none focus:border-brand-gold"
                aria-label={`Status do pedido ${o.id}`}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-4 grid gap-1 border-t border-line pt-3 text-sm text-dim sm:grid-cols-2">
            {o.items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-4">
                <span>
                  {it.qty}× {it.name}
                </span>
                <span>{brl(it.priceCents * it.qty)}</span>
              </li>
            ))}
          </ul>
          {o.note && (
            <p className="mt-3 border-l-2 border-brand-gold pl-3 text-xs italic text-dim">Obs.: “{o.note}”</p>
          )}
        </article>
      ))}
    </div>
  );
}

/* ---------------- CARDÁPIO ---------------- */

type ProductForm = {
  id: number | null;
  name: string;
  categoryId: number;
  price: string;
  description: string;
  tag: string;
  imageUrl: string;
  available: boolean;
  featured: boolean;
};

const EMPTY_FORM: ProductForm = {
  id: null,
  name: "",
  categoryId: 0,
  price: "",
  description: "",
  tag: "",
  imageUrl: "",
  available: true,
  featured: false,
};

function parsePrice(s: string): number | null {
  const clean = s.trim().replace("R$", "").trim();
  if (!clean) return null;
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  const v = Number(normalized);
  return Number.isFinite(v) && v > 0 ? Math.round(v * 100) : null;
}

function CardapioAdmin({ groups, onChanged }: { groups: MenuGroup[]; onChanged: () => void }) {
  const [form, setForm] = useState<ProductForm | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const allProducts = groups.flatMap((g) => g.products.map((p) => ({ ...p, category: g.name })));

  function startNew() {
    setForm({ ...EMPTY_FORM, categoryId: groups[0]?.id ?? 0 });
    setError("");
  }

  function startEdit(id: number) {
    const p = allProducts.find((x) => x.id === id);
    if (!p) return;
    setForm({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      price: (p.priceCents / 100).toFixed(2).replace(".", ","),
      description: p.description,
      tag: p.tag ?? "",
      imageUrl: p.imageUrl ?? "",
      available: p.available,
      featured: p.featured,
    });
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const priceCents = parsePrice(form.price);
    if (!form.name.trim() || priceCents === null || !form.categoryId) {
      setError("Preencha nome, categoria e preço válido (ex.: 38,90).");
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      priceCents,
      description: form.description,
      tag: form.tag || null,
      imageUrl: form.imageUrl || null,
      available: form.available,
      featured: form.featured,
    };
    const res = await fetch(form.id ? `/api/products/${form.id}` : "/api/products", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError(d?.error || "Erro ao salvar.");
      return;
    }
    setForm(null);
    onChanged();
  }

  async function patch(id: number, data: Record<string, unknown>) {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    onChanged();
  }

  async function remove(id: number) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      window.setTimeout(() => setConfirmDelete((c) => (c === id ? null : c)), 3000);
      return;
    }
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    onChanged();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="display-tight flex items-center gap-3 text-2xl font-semibold">
          <IconBox className="h-5 w-5 text-brand-gold" /> Itens do cardápio ({allProducts.length})
        </h2>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 bg-brand-gold px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-coal transition hover:bg-cream"
        >
          <IconPlus className="h-4 w-4" /> Novo item
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="rise-in mt-6 grid gap-4 border border-brand-gold/50 bg-panel p-6 sm:grid-cols-2">
          <p className="sm:col-span-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-brand-gold">
            {form.id ? `Editando item #${form.id}` : "Novo item do cardápio"}
          </p>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">Nome</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">Categoria</span>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              className="input-base"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">Preço (R$)</span>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-base" placeholder="38,90" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">Selo (opcional)</span>
            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="input-base" placeholder="Mais pedido" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">Descrição</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-base resize-none" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-dim">URL da imagem (opcional)</span>
            <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-base" placeholder="https://…" />
          </label>
          <div className="flex gap-6 sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-dim">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 accent-[#ffce00]" />
              Disponível hoje
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-dim">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#ffce00]" />
              Destaque na home
            </label>
          </div>
          {error && <p className="border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-sm text-brand-red sm:col-span-2">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className="bg-brand-gold px-6 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-coal transition hover:bg-cream disabled:opacity-50">
              {busy ? "Salvando…" : "Salvar item"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="border border-line px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-dim transition hover:text-cream">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 divide-y divide-line border border-line bg-panel">
        {allProducts.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt="" className="h-12 w-12 object-cover" loading="lazy" />
            ) : (
              <span className="grid h-12 w-12 place-items-center bg-coal">
                <LogoMark className="h-7 w-7 opacity-40" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold uppercase tracking-wide">
                {p.name}
                {p.featured && <span className="ml-2 text-[10px] text-brand-gold">★ destaque</span>}
              </p>
              <p className="text-xs text-dim">
                {p.category} · {brl(p.priceCents)}
              </p>
            </div>
            <button
              onClick={() => patch(p.id, { available: !p.available })}
              className={`border px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                p.available
                  ? "border-brand-gold/60 text-brand-gold"
                  : "border-brand-red/60 text-brand-red"
              }`}
            >
              {p.available ? "Disponível" : "Esgotado"}
            </button>
            <button
              onClick={() => patch(p.id, { featured: !p.featured })}
              className={`border px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                p.featured ? "border-cream text-cream" : "border-line text-dim hover:text-cream"
              }`}
            >
              Destaque
            </button>
            <button
              onClick={() => startEdit(p.id)}
              className="grid h-9 w-9 place-items-center border border-line text-dim transition hover:border-brand-gold hover:text-brand-gold"
              aria-label={`Editar ${p.name}`}
            >
              <IconEdit className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(p.id)}
              className={`grid h-9 w-9 place-items-center border transition ${
                confirmDelete === p.id
                  ? "border-brand-red bg-brand-red text-coal"
                  : "border-line text-dim hover:border-brand-red hover:text-brand-red"
              }`}
              aria-label={`Excluir ${p.name}`}
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- AVALIAÇÕES ---------------- */

function AvaliacoesAdmin({ reviews, onChanged }: { reviews: Review[]; onChanged: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  async function toggle(r: Review) {
    await fetch(`/api/reviews/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !r.approved }),
    });
    onChanged();
  }

  async function remove(id: number) {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      window.setTimeout(() => setConfirmDelete((c) => (c === id ? null : c)), 3000);
      return;
    }
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    onChanged();
  }

  return (
    <div>
      <h2 className="display-tight flex items-center gap-3 text-2xl font-semibold">
        <IconStar className="h-5 w-5 text-brand-gold" /> Moderação de avaliações ({reviews.length})
      </h2>
      <ul className="mt-6 space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className={`border bg-panel p-5 ${r.approved ? "border-line" : "border-brand-red/50"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Stars value={r.rating} />
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{r.authorName}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-dim">
                  {r.source === "google" ? "· Google" : "· Site"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(r)}
                  className={`border px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    r.approved
                      ? "border-brand-gold/60 text-brand-gold"
                      : "border-line text-dim hover:text-cream"
                  }`}
                >
                  {r.approved ? "Publicada" : "Ocultar"}
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className={`grid h-8 w-8 place-items-center border transition ${
                    confirmDelete === r.id
                      ? "border-brand-red bg-brand-red text-coal"
                      : "border-line text-dim hover:border-brand-red hover:text-brand-red"
                  }`}
                  aria-label="Excluir avaliação"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream/90">“{r.text}”</p>
            <p className="mt-2 text-[11px] text-dim">{formatDateTime(r.createdAt)}</p>
          </li>
        ))}
        {reviews.length === 0 && (
          <li className="border border-line bg-panel px-5 py-8 text-center text-sm text-dim">
            Nenhuma avaliação para moderar.
          </li>
        )}
      </ul>
    </div>
  );
}
