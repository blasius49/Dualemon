export function brl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Ter–Qui e Dom: 18h–22h · Sex e Sáb: 18h–23h · Seg: fechado */
export const WEEK_HOURS: { day: string; open: number | null; close: number | null }[] = [
  { day: "Segunda", open: null, close: null },
  { day: "Terça", open: 18, close: 22 },
  { day: "Quarta", open: 18, close: 22 },
  { day: "Quinta", open: 18, close: 22 },
  { day: "Sexta", open: 18, close: 23 },
  { day: "Sábado", open: 18, close: 23 },
  { day: "Domingo", open: 18, close: 22 },
];

export function openState(date = new Date()): { open: boolean; label: string } {
  const jsDay = date.getDay(); // 0 dom ... 6 sáb
  const idx = jsDay === 0 ? 6 : jsDay - 1; // 0 seg ... 6 dom
  const entry = WEEK_HOURS[idx];
  const hour = date.getHours() + date.getMinutes() / 60;
  if (entry.open !== null && entry.close !== null && hour >= entry.open && hour < entry.close) {
    return { open: true, label: `Aberto · fecha ${String(entry.close).padStart(2, "0")}:00` };
  }
  if (entry.open !== null && hour < entry.open) {
    return { open: false, label: `Fechado · abre hoje ${String(entry.open).padStart(2, "0")}:00` };
  }
  const next = WEEK_HOURS[(idx + 1) % 7];
  const nextDay = next.open !== null ? WEEK_HOURS[(idx + 1) % 7].day : "esta semana";
  return { open: false, label: `Fechado · abre ${nextDay} ${next.open ? String(next.open).padStart(2, "0") : "18"}:00` };
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "Recebido",
  preparing: "Na chapa",
  ready: "Pronto",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const STATUS_FLOW = ["pending", "preparing", "ready", "delivered"] as const;
