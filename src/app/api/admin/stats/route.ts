import { NextResponse } from "next/server";
import { and, count, eq, gte, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, reviews } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Acesso restrito à administração." }, { status: 403 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [all] = await db
    .select({
      total: count(),
      revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
    })
    .from(orders)
    .where(ne(orders.status, "cancelled"));

  const [today] = await db
    .select({
      total: count(),
      revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
    })
    .from(orders)
    .where(and(gte(orders.createdAt, startOfDay), ne(orders.status, "cancelled")));

  const [queue] = await db
    .select({ total: count() })
    .from(orders)
    .where(inArray(orders.status, ["pending", "preparing"]));

  const [reviewAgg] = await db
    .select({ avg: sql<string>`coalesce(avg(${reviews.rating}), 0)`, total: count() })
    .from(reviews)
    .where(eq(reviews.approved, true));

  const [prodAgg] = await db.select({ total: count() }).from(products).where(eq(products.available, true));

  return NextResponse.json({
    ordersTotal: all.total,
    revenueTotal: all.revenue,
    ordersToday: today.total,
    revenueToday: today.revenue,
    inQueue: queue.total,
    reviewAvg: Number(reviewAgg.avg),
    reviewCount: reviewAgg.total,
    productsActive: prodAgg.total,
  });
}


