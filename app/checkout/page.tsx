import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CheckoutContent from "./CheckoutContent"

export const metadata: Metadata = {
  title: "Checkout | KIREN",
  description: "Completá tu compra",
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login?redirect=/checkout")
  }

  // Obtener perfil del usuario para prellenar datos
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone")
    .eq("id", user.id)
    .single()

  // Obtener última dirección usada (si existe)
  const { data: lastOrder } = await supabase
    .from("orders")
    .select("shipping_address")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const initialData = {
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    phone: profile?.phone || "",
    email: user.email || "",
    lastAddress: lastOrder?.shipping_address || null,
  }

  return <CheckoutContent initialData={initialData} />
}
