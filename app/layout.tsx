import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart";
import "./globals.css";

// Fuente para el cuerpo del texto
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fuente para logo y títulos importantes
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KIREN | Tienda Minimalista",
  description: "Descubre moda y productos de estilo de vida minimalista en kiren.",
  keywords: ["minimalista", "moda", "tienda", "estilo de vida", "ropa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-inter antialiased bg-white text-black">
        {/* Header fijo */}
        <CartProvider>
          <Header />
          
          {/* Contenido principal con padding-top para compensar header fijo */}
          <main className="pt-20 lg:pt-24">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}