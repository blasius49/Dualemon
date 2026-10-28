"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import type { Me, Product } from "@/lib/types";
import { brl } from "@/lib/format";
import { IconCart, IconCheck, IconMinus, IconPlus, IconTrash, IconX } from "./Icons";
import { LogoMark } from "./Logo";

export type CartLine = {
  productId: number;
  name: string;
  priceCents: number;
  qty: number;
  imageUrl: string | null;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Product) => void;
  inc: (id: number) => void;
  dec: (id: number) => void;
  remove: (id: number) => void;
  qtyOf: (id: number) => number;
  openCart: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}

const KEY = "dualemon_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignora cache corrompido */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const add = useCallback((p: Product) => {
    setLines((prev) => {
      const found = prev.find((l) => l.productId === p.id);
      if (found) {
        return prev.map((l) => (l.productId === p.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        { productId: p.id, name: p.name, priceCents: p.priceCents, qty: 1, imageUrl: p.imageUrl },
      ];
    });
  }, []);

  const inc = useCallback((id: number) => {
    setLines((prev) => prev.map((l) => (l.productId === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((id: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.productId === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const remove = useCallback((id: number) => {
    setLines((prev) => prev.filter((l) => l.productId !== id));
  }, []);

  const qtyOf = useCallback((id: number) => lines.find((l) => l.productId === id)?.qty ?? 0, [lines]);

  const count = useMemo(() => lines.reduce((acc, l) => acc + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((acc, l) => acc + l.qty * l.priceCents, 0), [lines]);

  const value = useMemo<CartCtx>(
    () => ({ lines, count, subtotal, add, inc, dec, remove, qtyOf, openCart: () => setOpen(true) }),
    [lines, count, subtotal, add, inc, dec, remove, qtyOf]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        lines={lines}
        subtotal={subtotal}
        inc={inc}
        dec={dec}
        remove={remove}
        clear={() => setLines([])}
      />
    </Ctx.Provider>
  );
}

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  subtotal: number;
  inc: (id: number) => void;
  dec: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

function CartDrawer({ open, onClose, lines, subtotal, inc, dec, remove, clear }: DrawerProps) {
  const [stage, setStage] = useState<"cart" | "form" | "done">("cart");
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("Pix");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setMe(data as Me);
          setName((n) => n || (data as Me).name);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit() {
    setError("");
    if (!name.trim()) {
      setError("Informe seu nome para o pedido.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
          customerName: name.trim(),
          phone: phone.trim() || null,
          payment,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível enviar o pedido.");
        return;
      }
      setOrderId(data.id as number);
      clear();
      setStage("done");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-coal/80 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-panel transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <div>
              <p className="display-tight text-lg font-semibold">Seu pedido</p>
              <p className="text-xs text-dim">Dualemon · Pomerode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-line text-dim transition hover:border-brand-gold hover:text-brand-gold"
            aria-label="Fechar carrinho"
          >
            <IconX className="h-4 w-4" />
          </button>
        </header>

        {stage === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <IconCart className="h-10 w-10 text-line" />
                  <p className="text-sm text-dim">
                    Sua sacola está vazia.
                    <br />
                    Que tal um Pomerode Smash?
                  </p>
                  <Link
                    href="/cardapio"
                    onClick={onClose}
                    className="border border-brand-gold px-4 py-2 font-display text-sm font-semibold uppercase tracking-widest text-brand-gold transition hover:bg-brand-gold hover:text-coal"
                  >
                    Ver cardápio
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex gap-3 border border-line bg-panel-2 p-3">
                      {l.imageUrl ? (
                        <img
                          src={l.imageUrl}
                          alt={l.name}
                          className="h-16 w-16 shrink-0 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-16 w-16 shrink-0 place-items-center bg-coal">
                          <LogoMark className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-sm font-semibold uppercase tracking-wide">{l.name}</p>
                          <button
                            onClick={() => remove(l.productId)}
                            className="text-dim transition hover:text-brand-red"
                            aria-label={`Remover ${l.name}`}
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-dim">{brl(l.priceCents)} cada</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => dec(l.productId)}
                              className="grid h-7 w-7 place-items-center text-dim transition hover:bg-coal hover:text-cream"
                              aria-label="Diminuir"
                            >
                              <IconMinus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center font-display text-sm font-semibold">{l.qty}</span>
                            <button
                              onClick={() => inc(l.productId)}
                              className="grid h-7 w-7 place-items-center text-dim transition hover:bg-coal hover:text-cream"
                              aria-label="Aumentar"
                            >
                              <IconPlus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-display text-sm font-semibold text-brand-gold">
                            {brl(l.priceCents * l.qty)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <footer className="border-t border-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-dim">Subtotal</span>
                <span className="font-display text-2xl font-semibold text-brand-gold">{brl(subtotal)}</span>
              </div>
              <button
                disabled={lines.length === 0}
                onClick={() => setStage("form")}
                className="w-full bg-brand-gold py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
              >
                Finalizar pedido
              </button>
              <p className="mt-2 text-center text-[11px] text-dim">
                Retirada no balcão ou entrega em Pomerode e região.
              </p>
            </footer>
          </>
        )}

        {stage === "form" && (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <button
                onClick={() => setStage("cart")}
                className="text-xs uppercase tracking-widest text-dim transition hover:text-brand-gold"
              >
                ← Voltar à sacola
              </button>
              <Field label="Nome para o pedido">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="input-base"
                />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(47) 9…"
                  className="input-base"
                />
              </Field>
              <Field label="Pagamento na retirada">
                <div className="grid grid-cols-3 gap-2">
                  {["Pix", "Cartão", "Dinheiro"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayment(p)}
                      className={`border py-2 font-display text-xs font-semibold uppercase tracking-widest transition ${
                        payment === p
                          ? "border-brand-gold bg-brand-gold text-coal"
                          : "border-line text-dim hover:border-cream hover:text-cream"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Observações (opcional)">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Ex.: ponto da carne, sem cebola, trocar bebida…"
                  className="input-base resize-none"
                />
              </Field>
              <div className="border border-line bg-panel-2 p-3 text-sm">
                <div className="flex justify-between text-dim">
                  <span>{lines.reduce((a, l) => a + l.qty, 0)} itens</span>
                  <span className="font-display text-base font-semibold text-brand-gold">{brl(subtotal)}</span>
                </div>
              </div>
              {error && (
                <p className="border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-sm text-brand-red">
                  {error}
                </p>
              )}
            </div>
            <footer className="border-t border-line px-5 py-4">
              <button
                onClick={submit}
                disabled={busy}
                className="w-full bg-brand-gold py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-coal transition hover:bg-cream disabled:opacity-50"
              >
                {busy ? "Enviando…" : `Confirmar pedido · ${brl(subtotal)}`}
              </button>
              {me && <p className="mt-2 text-center text-[11px] text-dim">Pedindo como {me.name}</p>}
            </footer>
          </>
        )}

        {stage === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-brand-gold text-brand-gold">
              <IconCheck className="h-7 w-7" />
            </span>
            <h3 className="display-tight text-3xl font-semibold">Pedido #{orderId} recebido!</h3>
            <p className="text-sm text-dim">
              A cozinha já foi avisada. Você acompanha o status em tempo real na área do cliente.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/conta"
                onClick={onClose}
                className="bg-brand-gold px-5 py-2.5 font-display text-sm font-bold uppercase tracking-widest text-coal transition hover:bg-cream"
              >
                Meus pedidos
              </Link>
              <button
                onClick={() => {
                  setStage("cart");
                  onClose();
                }}
                className="border border-line px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-widest text-cream transition hover:border-brand-gold hover:text-brand-gold"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-dim">{label}</span>
      {children}
    </label>
  );
}
