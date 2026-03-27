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

    const { data, error } = await supabase
      .from("banners")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating banner:", error)
      return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
    }

    return NextResponse.json({ success: true, banner: data })
  } catch (error) {
    console.error("Error in PUT /api/admin/banners/[id]:", error)
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

    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting banner:", error)
      return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/admin/banners/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
