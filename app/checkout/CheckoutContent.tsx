"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useCartStore } from "@/stores/cartStore"
import { createOrder } from "./actions"
import type { PaymentMethod, ShippingAddress } from "@/lib/orders"

// Formateador de precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Ciudades de Paraguay (principales)
const cities = [
  "Asunción",
  "San Lorenzo",
  "Luque",
  "Capiatá",
  "Lambaré",
  "Fernando de la Mora",
  "Limpio",
  "Ñemby",
  "Mariano Roque Alonso",
  "Villa Elisa",
  "San Antonio",
  "Itauguá",
  "Areguá",
  "Ypacaraí",
  "Encarnación",
  "Ciudad del Este",
  "Pedro Juan Caballero",
  "Coronel Oviedo",
  "Caaguazú",
  "Concepción",
]

interface CheckoutContentProps {
  initialData: {
    firstName: string
    lastName: string
    phone: string
    email: string
    lastAddress: ShippingAddress | null
  }
}

type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutContent({ initialData }: CheckoutContentProps) {
  const router = useRouter()
  const { items, getSubtotal, getItemPrice, clearCart } = useCartStore()

  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Datos del formulario
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    firstName: initialData.firstName || initialData.lastAddress?.firstName || "",
    lastName: initialData.lastName || initialData.lastAddress?.lastName || "",
    phone: initialData.phone || initialData.lastAddress?.phone || "",
    street: initialData.lastAddress?.street || "",
    number: initialData.lastAddress?.number || "",
    apartment: initialData.lastAddress?.apartment || "",
    city: initialData.lastAddress?.city || "Asunción",
    neighborhood: initialData.lastAddress?.neighborhood || "",
    reference: initialData.lastAddress?.reference || "",
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery")
  const [notes, setNotes] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Refs para animaciones
  const pageRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // Calcular totales
  const subtotal = getSubtotal()
  const shippingCost = subtotal >= 300000 ? 0 : 25000
  const total = subtotal + shippingCost

  // Animación de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [step])

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito")
    }
  }, [items, router])

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value })
  }

  const validateShipping = (): boolean => {
    if (!shippingData.firstName.trim()) {
      setError("El nombre es requerido")
      return false
    }
    if (!shippingData.lastName.trim()) {
      setError("El apellido es requerido")
      return false
    }
    if (!shippingData.phone.trim()) {
      setError("El teléfono es requerido")
      return false
    }
    if (!shippingData.street.trim()) {
      setError("La calle es requerida")
      return false
    }
    if (!shippingData.number.trim()) {
      setError("El número es requerido")
      return false
    }
    if (!shippingData.city) {
      setError("La ciudad es requerida")
      return false
    }
    if (!shippingData.neighborhood.trim()) {
      setError("El barrio es requerido")
      return false
    }
    return true
  }

  const handleContinueToPayment = () => {
    setError(null)
    if (validateShipping()) {
      setStep("payment")
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleContinueToConfirmation = () => {
    setError(null)
    if (!acceptTerms) {
      setError("Debés aceptar los términos y condiciones")
      return
    }
    setStep("confirmation")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePlaceOrder = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await createOrder({
        paymentMethod,
        shippingAddress: shippingData,
        notes: notes || undefined,
      })

      if (!result.success) {
        setError(result.error || "Error al crear el pedido")
        return
      }

      // Limpiar carrito local
      clearCart()

      // Redirigir a página de éxito
      router.push(`/checkout/exito?order=${result.orderNumber}`)
    } catch (err) {
      setError("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="container-kiren py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-oswald text-2xl font-bold tracking-wider">
              KIREN
            </Link>
            <Link
              href="/carrito"
              className="font-inter text-sm text-black/60 hover:text-black transition-colors cursor-pointer"
            >
              ← Volver al carrito
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-black/10">
        <div className="container-kiren py-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className={`font-inter ${step === "shipping" ? "text-black font-medium" : "text-black/40"}`}>
              1. Envío
            </span>
            <span className="text-black/20">→</span>
            <span className={`font-inter ${step === "payment" ? "text-black font-medium" : "text-black/40"}`}>
              2. Pago
            </span>
            <span className="text-black/20">→</span>
            <span className={`font-inter ${step === "confirmation" ? "text-black font-medium" : "text-black/40"}`}>
              3. Confirmar
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-kiren py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario */}
          <div ref={formRef} className="lg:col-span-2">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-inter">
                {error}
              </div>
            )}

            {/* Step 1: Datos de envío */}
            {step === "shipping" && (
              <div>
                <h2 className="font-oswald text-2xl font-semibold mb-6">
                  Datos de envío
                </h2>

                <div className="space-y-5">
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      placeholder="0981 123 456"
                      className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Calle y Número */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Calle *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={shippingData.street}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={shippingData.number}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                      Departamento / Piso{" "}
                      <span className="text-black/30 normal-case">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={shippingData.apartment}
                      onChange={handleShippingChange}
                      placeholder="Ej: Piso 3, Depto B"
                      className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Ciudad y Barrio */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Ciudad *
                      </label>
                      <select
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors bg-white"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                        Barrio *
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={shippingData.neighborhood}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Referencia */}
                  <div>
                    <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                      Referencia{" "}
                      <span className="text-black/30 normal-case">(opcional)</span>
                    </label>
                    <textarea
                      name="reference"
                      value={shippingData.reference}
                      onChange={handleShippingChange}
                      rows={2}
                      placeholder="Ej: Casa esquina, portón verde, frente a la plaza..."
                      className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Continuar */}
                <button
                  onClick={handleContinueToPayment}
                  className="w-full mt-8 py-4 bg-black text-white font-inter text-sm font-medium hover:bg-black/90 transition-colors cursor-pointer"
                >
                  Continuar al pago
                </button>
              </div>
            )}

            {/* Step 2: Método de pago */}
            {step === "payment" && (
              <div>
                <h2 className="font-oswald text-2xl font-semibold mb-6">
                  Método de pago
                </h2>

                <div className="space-y-4">
                  {/* Efectivo contra entrega */}
                  <label
                    className={`block p-5 border cursor-pointer transition-colors ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-black bg-black/[0.02]"
                        : "border-black/20 hover:border-black/40"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === "cash_on_delivery"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
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
                              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                            />
                          </svg>
                          <span className="font-inter font-medium">
                            Efectivo contra entrega
                          </span>
                        </div>
                        <p className="font-inter text-sm text-black/60">
                          Pagá en efectivo cuando recibas tu pedido. El delivery llevará cambio.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Transferencia bancaria */}
                  <label
                    className={`block p-5 border cursor-pointer transition-colors ${
                      paymentMethod === "bank_transfer"
                        ? "border-black bg-black/[0.02]"
                        : "border-black/20 hover:border-black/40"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
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
                              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                            />
                          </svg>
                          <span className="font-inter font-medium">
                            Transferencia bancaria
                          </span>
                        </div>
                        <p className="font-inter text-sm text-black/60">
                          Realizá una transferencia y envianos el comprobante por WhatsApp.
                          Tu pedido se procesará una vez confirmado el pago.
                        </p>
                        {paymentMethod === "bank_transfer" && (
                          <div className="mt-4 p-4 bg-black/5 text-sm">
                            <p className="font-medium mb-2">Datos bancarios:</p>
                            <p>Banco: <span className="text-black/70">Banco Continental</span></p>
                            <p>Titular: <span className="text-black/70">KIREN S.A.</span></p>
                            <p>Cuenta: <span className="text-black/70">1234567890</span></p>
                            <p>RUC: <span className="text-black/70">80123456-7</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Notas */}
                <div className="mt-6">
                  <label className="block font-inter text-xs font-medium uppercase tracking-wider text-black/60 mb-2">
                    Notas del pedido{" "}
                    <span className="text-black/30 normal-case">(opcional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Instrucciones especiales para tu pedido..."
                    className="w-full px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                {/* Términos */}
                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="font-inter text-sm text-black/70">
                    Acepto los{" "}
                    <Link href="/terminos" className="underline hover:text-black">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="underline hover:text-black">
                      política de privacidad
                    </Link>
                  </span>
                </label>

                {/* Botones */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep("shipping")}
                    className="px-6 py-4 border border-black/20 font-inter text-sm hover:border-black transition-colors cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handleContinueToConfirmation}
                    className="flex-1 py-4 bg-black text-white font-inter text-sm font-medium hover:bg-black/90 transition-colors cursor-pointer"
                  >
                    Revisar pedido
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {step === "confirmation" && (
              <div>
                <h2 className="font-oswald text-2xl font-semibold mb-6">
                  Confirmar pedido
                </h2>

                {/* Resumen de envío */}
                <div className="border border-black/10 p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-inter font-medium">Dirección de envío</h3>
                    <button
                      onClick={() => setStep("shipping")}
                      className="font-inter text-xs text-black/50 hover:text-black"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="font-inter text-sm text-black/70">
                    {shippingData.firstName} {shippingData.lastName}
                  </p>
                  <p className="font-inter text-sm text-black/70">
                    {shippingData.street} {shippingData.number}
                    {shippingData.apartment && `, ${shippingData.apartment}`}
                  </p>
                  <p className="font-inter text-sm text-black/70">
                    {shippingData.neighborhood}, {shippingData.city}
                  </p>
                  <p className="font-inter text-sm text-black/70">
                    Tel: {shippingData.phone}
                  </p>
                </div>

                {/* Resumen de pago */}
                <div className="border border-black/10 p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-inter font-medium">Método de pago</h3>
                    <button
                      onClick={() => setStep("payment")}
                      className="font-inter text-xs text-black/50 hover:text-black"
                    >
                      Editar
                    </button>
                  </div>
                  <p className="font-inter text-sm text-black/70">
                    {paymentMethod === "cash_on_delivery"
                      ? "Efectivo contra entrega"
                      : "Transferencia bancaria"}
                  </p>
                </div>

                {/* Productos */}
                <div className="border border-black/10 p-5 mb-6">
                  <h3 className="font-inter font-medium mb-4">Productos</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4"
                      >
                        <div className="relative w-16 h-20 bg-black/5 flex-shrink-0">
                          {item.product.image && (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-inter text-sm">{item.product.name}</p>
                          {item.variant && (
                            <p className="font-inter text-xs text-black/50">
                              {item.variant.name}
                            </p>
                          )}
                        </div>
                        <p className="font-inter text-sm">
                          {formatPrice(getItemPrice(item) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón confirmar */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("payment")}
                    className="px-6 py-4 border border-black/20 font-inter text-sm hover:border-black transition-colors cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 py-4 bg-black text-white font-inter text-sm font-medium hover:bg-black/90 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Procesando...
                      </span>
                    ) : (
                      `Confirmar pedido • ${formatPrice(total)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-black/[0.02] p-6 sticky top-8">
              <h3 className="font-oswald text-lg font-semibold mb-6">
                Resumen del pedido
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-18 bg-black/5 flex-shrink-0">
                      {item.product.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm truncate">{item.product.name}</p>
                      {item.variant && (
                        <p className="font-inter text-xs text-black/50">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="font-inter text-sm mt-1">
                        {formatPrice(getItemPrice(item) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-black/10 pt-4 space-y-3">
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-black/60">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-black/60">Envío</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    <span>{formatPrice(shippingCost)}</span>
                  )}
                </div>
                {shippingCost > 0 && (
                  <p className="font-inter text-xs text-black/50">
                    Envío gratis en compras mayores a {formatPrice(300000)}
                  </p>
                )}
              </div>

              <div className="border-t border-black/10 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-lg font-semibold">Total</span>
                  <span className="font-oswald text-xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
