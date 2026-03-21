"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function RecoverForm() {
  const [email, setEmail] = useState("")
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
    setIsLoading(true)

    try {
      const supabase = getSupabaseClient()

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/nueva-contrasena`,
        }
      )

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess(true)
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
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h1 className="font-oswald text-2xl font-semibold tracking-wide mb-4">
            ¡Revisá tu email!
          </h1>
          <p className="font-inter text-black/60 mb-8">
            Si existe una cuenta con{" "}
            <span className="font-medium text-black">{email}</span>, te enviamos
            un enlace para restablecer tu contraseña.
          </p>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
          >
            Volver a iniciar sesión
          </Link>

          <p className="mt-6 font-inter text-xs text-black/50">
            ¿No recibiste el email? Revisá tu carpeta de spam o{" "}
            <button
              onClick={() => setSuccess(false)}
              className="underline hover:text-black"
            >
              intentá de nuevo
            </button>
            .
          </p>
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
            Recuperar contraseña
          </h1>
          <p className="font-inter text-sm text-black/60 mt-2">
            Ingresá tu email y te enviaremos un enlace para restablecer tu
            contraseña.
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

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="tu@email.com"
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
                Enviando...
              </span>
            ) : (
              "Enviar enlace"
            )}
          </button>
        </form>

        {/* Volver al login */}
        <div className="mt-8 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 font-inter text-sm text-black/50 hover:text-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
