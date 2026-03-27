"use client"

import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { AdminUser } from "@/lib/admin"

interface AdminHeaderProps {
  admin: AdminUser
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Breadcrumb / Title area */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden w-8" /> {/* Spacer for mobile */}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Admin info */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="font-inter text-sm text-neutral-900">
                {admin.fullName || admin.email}
              </p>
              <p className="font-inter text-xs text-neutral-500">
                Administrador
              </p>
            </div>
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <span className="font-inter text-sm text-white font-medium">
                {(admin.fullName || admin.email).charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
