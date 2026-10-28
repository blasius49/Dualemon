import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const rows =
    session.role === "admin"
      ? await db.select().from(orders).orderBy(desc(orders.createdAt))
      : await db.select().from(orders).where(eq(orders.userId, session.userId)).orderBy(desc(orders.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await getSession();
  const body = await req.json().catch(() => null);
  const itemsReq: { productId: number; qty: number }[] = Array.isArray(body?.items) ? body.items : [];
  if (itemsReq.length === 0) {
    return NextResponse.json({ error: "Seu pedido está vazio." }, { status: 400 });
  }

  const ids = itemsReq.map((i) => Number(i.productId)).filter((n) => Number.isFinite(n));
  const rows = await db.select().from(products).where(inArray(products.id, ids));

  const lines: OrderItem[] = [];
  let total = 0;
  for (const it of itemsReq) {
    const product = rows.find((r) => r.id === Number(it.productId));
    if (!product || !product.available) {
      return NextResponse.json({ error: `Item indisponível no momento.` }, { status: 400 });
    }
    const qty = Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 1)));
    lines.push({ productId: product.id, name: product.name, priceCents: product.priceCents, qty });
    total += product.priceCents * qty;
  }

  const customerName = String(body?.customerName ?? session?.name ?? "").trim();
  if (!customerName) {
    return NextResponse.json({ error: "Informe o nome para o pedido." }, { status: 400 });
  }

  const [created] = await db
    .insert(orders)
    .values({
      userId: session?.userId ?? null,
      customerName,
      phone: body?.phone ? String(body.phone).trim() : null,
      items: lines,
      totalCents: total,
      payment: String(body?.payment ?? "Pix"),
      note: body?.note ? String(body.note).trim() : null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
