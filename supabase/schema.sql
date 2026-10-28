-- Dualemon schema. Run in the Supabase SQL Editor of a NEW project.
CREATE TYPE user_role AS ENUM ('customer','admin');
CREATE TYPE order_status AS ENUM ('pending','preparing','ready','delivered','cancelled');
CREATE TYPE review_source AS ENUM ('site','google');

CREATE TABLE IF NOT EXISTS users (
 id serial PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE,
 password_hash text NOT NULL, role user_role NOT NULL DEFAULT 'customer',
 created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS categories (
 id serial PRIMARY KEY, name text NOT NULL, slug text NOT NULL UNIQUE,
 position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
 id serial PRIMARY KEY,
 category_id integer NOT NULL REFERENCES categories(id),
 name text NOT NULL, description text NOT NULL DEFAULT '',
 price_cents integer NOT NULL, image_url text, tag text,
 available boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false,
 created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
 id serial PRIMARY KEY, user_id integer REFERENCES users(id),
 customer_name text NOT NULL, phone text, items jsonb NOT NULL,
 total_cents integer NOT NULL, status order_status NOT NULL DEFAULT 'pending',
 payment text NOT NULL DEFAULT 'Pix', note text,
 created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
 id serial PRIMARY KEY, user_id integer REFERENCES users(id),
 author_name text NOT NULL, rating integer NOT NULL, "text" text NOT NULL,
 source review_source NOT NULL DEFAULT 'site', approved boolean NOT NULL DEFAULT true,
 created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- Access occurs through the private server-side Postgres connection.
