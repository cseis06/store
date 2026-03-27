import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/admin"

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    // Verificar admin
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    // Validar campos requeridos
    if (!body.name || !body.slug || body.price === undefined) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar slug único
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", body.slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: "El slug ya existe" }, { status: 400 })
    }

    // Crear producto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: body.price,
        compare_at_price: body.compare_at_price || null,
        category_id: body.category_id || null,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
        is_new: body.is_new ?? false,
        is_on_sale: body.is_on_sale ?? false,
      })
      .select()
      .single()

    if (productError) {
      console.error("Error creating product:", productError)
      return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
    }

    // Si hay imagen, crear registro en product_images
    if (body.image_url) {
      const { error: imageError } = await supabase
        .from("product_images")
        .insert({
          product_id: product.id,
          url: body.image_url,
          is_primary: true,
          display_order: 0,
        })

      if (imageError) {
        console.error("Error creating product image:", imageError)
      }
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error in POST /api/admin/products:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
