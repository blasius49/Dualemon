import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["customer", "admin"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
]);
export const reviewSource = pgEnum("review_source", ["site", "google"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  position: integer("position").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url"),
  tag: text("tag"),
  available: boolean("available").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItem = {
  productId: number;
  name: string;
  priceCents: number;
  qty: number;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  customerName: text("customer_name").notNull(),
  phone: text("phone"),
  items: jsonb("items").notNull().$type<OrderItem[]>(),
  totalCents: integer("total_cents").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  payment: text("payment").notNull().default("Pix"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  source: reviewSource("source").notNull().default("site"),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
