import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const redirect = searchParams.get("redirect") || "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirigir al destino original o al home
      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Si hay error, redirigir al login con mensaje
  return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
}
