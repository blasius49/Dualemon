import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import type { MenuGroup } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeAll = url.searchParams.get("all") === "1";
  const session = await getSession();
  const isAdmin = session?.role === "admin";

  const cats = await db.select().from(categories).orderBy(categories.position);
  const prods = await db
    .select()
    .from(products)
    .where(includeAll && isAdmin ? undefined : eq(products.available, true))
    .orderBy(products.id);

  const groups: MenuGroup[] = cats.map((c) => ({
    ...c,
    products: prods
      .filter((p) => p.categoryId === c.id)
      .map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })),
  }));
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const categoryId = Number(body?.categoryId);
  const priceCents = Math.round(Number(body?.priceCents));
  if (!name || !categoryId || !Number.isFinite(priceCents) || priceCents <= 0) {
    return NextResponse.json({ error: "Nome, categoria e preço válido são obrigatórios." }, { status: 400 });
  }
  const [created] = await db
    .insert(products)
    .values({
      categoryId,
      name,
      description: String(body?.description ?? "").trim(),
      priceCents,
      imageUrl: body?.imageUrl ? String(body.imageUrl).trim() : null,
      tag: body?.tag ? String(body.tag).trim() : null,
      available: body?.available !== false,
      featured: body?.featured === true,
    })
    .returning();
  return NextResponse.json(created, { status: 201 });
}
