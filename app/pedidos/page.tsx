import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMyOrders } from "@/lib/orders.server"
import OrdersList from "./OrdersList"

export const metadata: Metadata = {
  title: "Mis Pedidos | KIREN",
  description: "Historial de tus pedidos en KIREN",
}

export default async function PedidosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/pedidos")
  }

  const orders = await getMyOrders()

  return <OrdersList orders={orders} />
}
