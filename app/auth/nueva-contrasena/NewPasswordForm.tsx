"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import gsap from "gsap"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function NewPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  // Animación de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess(true)

      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      setError("Ocurrió un error. Por favor intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4">
        <div ref={formRef} className="w-full max-w-md text-center">
          {/* Icono */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>

          <h1 className="font-oswald text-2xl font-semibold tracking-wide mb-4">
            ¡Contraseña actualizada!
          </h1>
          <p className="font-inter text-black/60 mb-8">
            Tu contraseña fue cambiada exitosamente. Serás redirigido
            automáticamente...
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div ref={formRef} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <span className="font-oswald text-3xl font-bold tracking-wider">
              KIREN
            </span>
          </Link>
          <h1 className="font-oswald text-2xl font-semibold tracking-wide">
            Nueva contraseña
          </h1>
          <p className="font-inter text-sm text-black/60 mt-2">
            Ingresá tu nueva contraseña
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-inter">
              {error}
            </div>
          )}

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 pr-12 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Repetí tu contraseña"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white font-inter text-sm font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              "Guardar contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
