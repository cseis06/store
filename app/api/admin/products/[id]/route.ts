import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminUser } from "@/lib/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PUT - Actualizar producto
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()

    // Verificar slug único (excepto el mismo producto)
    if (body.slug) {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .single()

      if (existing) {
        return NextResponse.json({ error: "El slug ya existe" }, { status: 400 })
      }
    }

    // Actualizar producto
    const { data: product, error: productError } = await supabase
      .from("products")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (productError) {
      console.error("Error updating product:", productError)
      return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 })
    }

    // Actualizar imagen principal si se proporcionó
    if (body.image_url !== undefined) {
      // Primero marcar todas como no principales
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", id)

      if (body.image_url) {
        // Verificar si ya existe una imagen con esta URL
        const { data: existingImage } = await supabase
          .from("product_images")
          .select("id")
          .eq("product_id", id)
          .eq("url", body.image_url)
          .single()

        if (existingImage) {
          // Marcar como principal
          await supabase
            .from("product_images")
            .update({ is_primary: true })
            .eq("id", existingImage.id)
        } else {
          // Crear nueva imagen
          await supabase
            .from("product_images")
            .insert({
              product_id: id,
              url: body.image_url,
              is_primary: true,
              display_order: 0,
            })
        }
      }
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error in PUT /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminUser()
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()

    // Eliminar imágenes del producto primero
    await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id)

    // Eliminar variantes
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id)

    // Eliminar de colecciones
    await supabase
      .from("product_collections")
      .delete()
      .eq("product_id", id)

    // Eliminar producto
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/admin/products/[id]:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
