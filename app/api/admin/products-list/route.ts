import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/admin"

export async function GET() {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        price,
        product_images (url, is_primary)
      `)
      .eq("is_active", true)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching products:", error)
      return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
    }

    // Formatear para incluir imagen principal
    const products = data?.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image_url: p.product_images?.find((img: any) => img.is_primary)?.url || null,
    })) || []

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error in GET /api/admin/products-list:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
