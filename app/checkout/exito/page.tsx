import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "¡Pedido confirmado! | KIREN",
  description: "Tu pedido fue confirmado exitosamente",
}

interface Props {
  searchParams: Promise<{ order?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderNumber } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icono de éxito */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide mb-4">
          ¡Gracias por tu compra!
        </h1>

        {/* Mensaje */}
        <p className="font-inter text-black/60 mb-6">
          Tu pedido fue recibido y está siendo procesado.
        </p>

        {/* Número de orden */}
        {orderNumber && (
          <div className="inline-block px-6 py-4 bg-black/[0.03] mb-8">
            <p className="font-inter text-xs text-black/50 uppercase tracking-wider mb-1">
              Número de pedido
            </p>
            <p className="font-oswald text-2xl font-bold">{orderNumber}</p>
          </div>
        )}

        {/* Info adicional */}
        <div className="bg-black/[0.02] p-6 mb-8 text-left space-y-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-black/60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div>
              <p className="font-inter font-medium text-sm">Confirmación por email</p>
              <p className="font-inter text-sm text-black/60">
                Te enviamos un email con los detalles de tu pedido.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-black/60"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="font-inter font-medium text-sm">¿Tenés alguna consulta?</p>
              <p className="font-inter text-sm text-black/60">
                Contactanos por WhatsApp al{" "}
                <a
                  href="https://wa.me/595981123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-black"
                >
                  0981 123 456
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pedidos"
            className="px-8 py-4 border border-black text-black font-inter text-sm font-medium hover:bg-black hover:text-white transition-colors"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-black text-white font-inter text-sm font-medium hover:bg-black/90 transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
