import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar slug único
    const { data: existing } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", body.slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: "El slug ya existe" }, { status: 400 })
    }

    // Crear colección
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
        display_order: body.display_order || 0,
      })
      .select()
      .single()

    if (collectionError) {
      console.error("Error creating collection:", collectionError)
      return NextResponse.json({ error: "Error al crear la colección" }, { status: 500 })
    }

    // Agregar productos a la colección
    if (body.product_ids && body.product_ids.length > 0) {
      const productCollections = body.product_ids.map((productId: string, index: number) => ({
        collection_id: collection.id,
        product_id: productId,
        display_order: index,
      }))

      const { error: pcError } = await supabase
        .from("product_collections")
        .insert(productCollections)

      if (pcError) {
        console.error("Error adding products to collection:", pcError)
      }
    }

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error("Error in POST /api/admin/collections:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
