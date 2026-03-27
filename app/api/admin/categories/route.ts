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

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", body.slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: "El slug ya existe" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        display_order: body.display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 })
    }

    return NextResponse.json({ success: true, category: data })
  } catch (error) {
    console.error("Error in POST /api/admin/categories:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
