import type { OrderItem } from "@/db/schema";

export type Category = {
  id: number;
  name: string;
  slug: string;
  position: number;
};

export type Product = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  tag: string | null;
  available: boolean;
  featured: boolean;
  createdAt: string;
};

export type MenuGroup = Category & { products: Product[] };

export type Review = {
  id: number;
  authorName: string;
  rating: number;
  text: string;
  source: "site" | "google";
  approved: boolean;
  createdAt: string;
};

export type ReviewStats = {
  average: number;
  count: number;
  distribution: number[]; // índice 0 => 1 estrela ... 4 => 5 estrelas
};

export type Order = {
  id: number;
  userId: number | null;
  customerName: string;
  phone: string | null;
  items: OrderItem[];
  totalCents: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  payment: string;
  note: string | null;
  createdAt: string;
};

export type Me = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
};
