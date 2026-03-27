import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    // Verificar slug único
    if (body.slug) {
      const { data: existing } = await supabase
        .from("collections")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .single()

      if (existing) {
        return NextResponse.json({ error: "El slug ya existe" }, { status: 400 })
      }
    }

    // Actualizar colección
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .update({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        is_featured: body.is_featured ?? false,
        display_order: body.display_order || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (collectionError) {
      console.error("Error updating collection:", collectionError)
      return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
    }

    // Actualizar productos de la colección
    if (body.product_ids !== undefined) {
      // Eliminar asociaciones anteriores
      await supabase
        .from("product_collections")
        .delete()
        .eq("collection_id", id)

      // Crear nuevas asociaciones
      if (body.product_ids.length > 0) {
        const productCollections = body.product_ids.map((productId: string, index: number) => ({
          collection_id: id,
          product_id: productId,
          display_order: index,
        }))

        const { error: pcError } = await supabase
          .from("product_collections")
          .insert(productCollections)

        if (pcError) {
          console.error("Error updating product collections:", pcError)
        }
      }
    }

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error("Error in PUT /api/admin/collections/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()

    // Eliminar asociaciones de productos
    await supabase
      .from("product_collections")
      .delete()
      .eq("collection_id", id)

    // Eliminar colección
    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting collection:", error)
      return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/admin/collections/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
