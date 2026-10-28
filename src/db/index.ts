import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

let localPool: Pool | undefined;

function getPool(): Pool {
  if (globalForDb.__arenaNextJsPostgresqlPool) return globalForDb.__arenaNextJsPostgresqlPool;
  if (!localPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is required at runtime; configure it in Vercel.");
    localPool = new Pool({ connectionString: url });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = localPool;
    }
  }
  return localPool;
}

// Avoid opening Postgres connections while Next.js collects API routes during build.
export const db = drizzle({
  client: new Proxy({} as Pool, {
    get(_target, key) {
      const pool = getPool();
      const value = Reflect.get(pool, key, pool);
      return typeof value === "function" ? value.bind(pool) : value;
    },
  }),
});
