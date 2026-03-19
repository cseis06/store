import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofertas | KIREN",
  description:
    "Descubri nuestra seleccion de prendas con descuentos exclusivos. Hasta 30% OFF en piezas seleccionadas. Stock limitado.",
  openGraph: {
    title: "Ofertas | KIREN",
    description:
      "Descubri nuestra seleccion de prendas con descuentos exclusivos. Hasta 30% OFF en piezas seleccionadas.",
    type: "website",
  },
};

export default function OfertasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}