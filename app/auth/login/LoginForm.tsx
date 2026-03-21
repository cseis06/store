"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import gsap from "gsap"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Por favor confirmá tu email antes de iniciar sesión")
        } else {
          setError(signInError.message)
        }
        return
      }

      // Redirigir
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError("Ocurrió un error. Por favor intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
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
            Iniciar sesión
          </h1>
          <p className="font-inter text-sm text-black/60 mt-2">
            Ingresá a tu cuenta para continuar
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60"
              >
                Contraseña
              </label>
              <Link
                href="/auth/recuperar"
                className="font-inter text-xs text-black/60 hover:text-black transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
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
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-black/40 text-xs font-inter">
              o
            </span>
          </div>
        </div>

        {/* Registro */}
        <p className="text-center font-inter text-sm text-black/60">
          ¿No tenés cuenta?{" "}
          <Link
            href={`/auth/registro${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
            className="text-black font-medium hover:underline"
          >
            Crear cuenta
          </Link>
        </p>

        {/* Volver */}
        <div className="mt-8 text-center">
          <Link
            href="/"
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
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
