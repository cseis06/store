"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface OrderStatusFormProps {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "processing", label: "Procesando" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]

const paymentStatusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "refunded", label: "Reembolsado" },
]

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: OrderStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar")
      }

      setMessage({ type: "success", text: "Estado actualizado correctamente" })
      router.refresh()
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
          Estado del pedido
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
          Estado del pago
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
        >
          {paymentStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className={`font-inter text-xs ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isUpdating || (status === currentStatus && paymentStatus === currentPaymentStatus)}
        className="w-full px-4 py-2.5 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? "Actualizando..." : "Actualizar estado"}
      </button>
    </form>
  )
}
