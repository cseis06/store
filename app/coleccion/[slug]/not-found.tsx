import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-kiren text-center py-20">
        <h1 className="font-oswald text-6xl lg:text-8xl font-bold text-black/10 mb-4">
          404
        </h1>
        <h2 className="font-oswald text-2xl lg:text-3xl font-semibold mb-4">
          Colección no encontrada
        </h2>
        <p className="font-inter text-black/60 max-w-md mx-auto mb-8">
          La colección que buscás no existe o ya no está disponible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/colecciones"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
          >
            Ver colecciones
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-black text-black font-inter text-sm hover:bg-black hover:text-white transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
