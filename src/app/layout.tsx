
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dualemon · Hamburgueria Artesanal em Pomerode-SC",
  description:
    "Smash burgers, bratwurst artesanal e chope colonial gelado em Pomerode-SC. R. Pres. Costa e Silva, 546 – Testo Rega. Nota 4,3 no Google.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-coal font-body text-cream antialiased">
        <div className="noise-overlay" aria-hidden="true" />

        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>

        <SpeedInsights />
      </body>
    </html>
  );
}
