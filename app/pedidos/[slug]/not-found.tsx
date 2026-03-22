import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="text-center">
        <h1 className="font-oswald text-6xl font-bold text-black/10 mb-4">404</h1>
        <h2 className="font-oswald text-2xl font-semibold mb-4">
          Pedido no encontrado
        </h2>
        <p className="font-inter text-black/60 max-w-md mx-auto mb-8">
          El pedido que buscás no existe o no tenés acceso a él.
        </p>
        <Link
          href="/pedidos"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
        >
          Ver mis pedidos
        </Link>
      </div>
    </div>
  )
}
