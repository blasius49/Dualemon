import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

async function adminGuard() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const id = Number((await params).id);
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });

  const set: Partial<typeof products.$inferInsert> = {};
  if (body.name !== undefined) set.name = String(body.name).trim();
  if (body.description !== undefined) set.description = String(body.description);
  if (body.categoryId !== undefined) set.categoryId = Number(body.categoryId);
  if (body.priceCents !== undefined) set.priceCents = Math.round(Number(body.priceCents));
  if (body.imageUrl !== undefined) set.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
  if (body.tag !== undefined) set.tag = body.tag ? String(body.tag).trim() : null;
  if (body.available !== undefined) set.available = body.available === true;
  if (body.featured !== undefined) set.featured = body.featured === true;

  const [updated] = await db.update(products).set(set).where(eq(products.id, id)).returning();
  if (!updated) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const id = Number((await params).id);
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
