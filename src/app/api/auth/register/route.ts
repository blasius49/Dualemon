import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
    return NextResponse.json(
      { error: "Informe nome, e-mail válido e senha com pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return NextResponse.json({ error: "Este e-mail já está cadastrado. Entre na sua conta." }, { status: 409 });
  }

  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), role: "customer" })
    .returning();

  await createSession({ userId: created.id, role: created.role, name: created.name });
  return NextResponse.json({ id: created.id, name: created.name, email: created.email, role: created.role });
}
