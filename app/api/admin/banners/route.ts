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

    if (!body.type) {
      return NextResponse.json({ error: "Falta el tipo de banner" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("banners")
      .insert({
        type: body.type,
        title: body.title || null,
        subtitle: body.subtitle || null,
        description: body.description || null,
        cta_text: body.cta_text || null,
        cta_link: body.cta_link || null,
        image_url: body.image_url || null,
        image_alt: body.image_alt || null,
        display_order: body.display_order || 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating banner:", error)
      return NextResponse.json({ error: "Error al crear el banner" }, { status: 500 })
    }

    return NextResponse.json({ success: true, banner: data })
  } catch (error) {
    console.error("Error in POST /api/admin/banners:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
