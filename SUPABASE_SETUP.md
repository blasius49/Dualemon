# Dualemon: Supabase + Vercel

1. Create a **separate Supabase project** for Dualemon. Do NOT run this SQL in the Forno d'Oro database: table names conflict.
2. Open the Supabase SQL Editor and run `supabase/schema.sql` once. On subsequent executions, the CREATE TYPE statements would fail, so do not repeat them.
3. Under Supabase **Connect**, get the PostgreSQL connection URI (Session Pooler is typically suited for Vercel). Enter your database password; encode URL-special characters.
4. In Vercel > Dualemon > Settings > Environment Variables, set `DATABASE_URL` and a random, private `SESSION_SECRET` (at least 32 bytes). Never use NEXT_PUBLIC_ for either.
5. Deploy, then check `/api/health`. A successful database health response doesn't imply the product catalog has been populated.
6. To populate sample products and reviews, run the existing seed script from a trusted local/CI environment with DATABASE_URL configured, after reviewing its example content. **Do not use its hardcoded admin login**; this branch changes it to read `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` from your local environment. Set a strong unique password and run only once. Do not configure those seed secrets in Vercel unless required.
7. The sample menu, business information, and reviews are demonstrations and should be verified/replaced before use for a real client.

Never paste database or session secrets into GitHub files or chat.
