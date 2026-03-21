import { Metadata } from "next"
import CartPageContent from "./CartPageContent"

export const metadata: Metadata = {
  title: "Carrito | KIREN",
  description: "Tu carrito de compras",
}

export default function CarritoPage() {
  return <CartPageContent />
}
