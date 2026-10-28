import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getSession } from "@/lib/auth";
import type { ReviewStats } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const session = await getSession();
  const includeAll = url.searchParams.get("all") === "1" && session?.role === "admin";

  const rows = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      rating: reviews.rating,
      text: reviews.text,
      source: reviews.source,
      approved: reviews.approved,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .where(includeAll ? undefined : eq(reviews.approved, true))
    .orderBy(desc(reviews.createdAt));

  const distribution = [0, 0, 0, 0, 0];
  let sum = 0;
  rows.forEach((r) => {
    sum += r.rating;
    distribution[Math.min(4, Math.max(0, r.rating - 1))] += 1;
  });
  const stats: ReviewStats = {
    average: rows.length ? sum / rows.length : 0,
    count: rows.length,
    distribution,
  };

  return NextResponse.json({ reviews: rows, stats });
}

export async function POST(req: Request) {
  const session = await getSession();
  const body = await req.json().catch(() => null);
  const rating = Math.round(Number(body?.rating));
  const text = String(body?.text ?? "").trim();
  const authorName = String(body?.authorName ?? session?.name ?? "").trim();

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Escolha uma nota de 1 a 5 estrelas." }, { status: 400 });
  }
  if (text.length < 10) {
    return NextResponse.json({ error: "Conte um pouco mais: mínimo de 10 caracteres." }, { status: 400 });
  }
  if (!authorName) {
    return NextResponse.json({ error: "Identifique-se para publicar a avaliação." }, { status: 400 });
  }

  const [created] = await db
    .insert(reviews)
    .values({ userId: session?.userId ?? null, authorName, rating, text, source: "site", approved: true })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
