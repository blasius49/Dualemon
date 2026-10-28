import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getSession } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const id = Number((await params).id);
  const body = await req.json().catch(() => null);
  const [updated] = await db
    .update(reviews)
    .set({ approved: body?.approved === true })
    .where(eq(reviews.id, id))
    .returning();
  if (!updated) return NextResponse.json({ error: "Avaliação não encontrada." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const id = Number((await params).id);
  const [deleted] = await db.delete(reviews).where(eq(reviews.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: "Avaliação não encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
