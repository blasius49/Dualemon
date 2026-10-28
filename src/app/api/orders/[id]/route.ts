import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSession } from "@/lib/auth";

const ALLOWED = ["pending", "preparing", "ready", "delivered", "cancelled"] as const;

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const id = Number((await params).id);
  const body = await req.json().catch(() => null);
  const status = String(body?.status ?? "");
  if (!(ALLOWED as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }
  const [updated] = await db
    .update(orders)
    .set({ status: status as (typeof ALLOWED)[number] })
    .where(eq(orders.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  return NextResponse.json(updated);
}
