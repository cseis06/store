import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-oswald text-6xl lg:text-8xl font-bold text-black/10 mb-4">
          404
        </h1>
        <h2 className="font-oswald text-2xl lg:text-3xl font-semibold tracking-wide mb-4">
          Producto no encontrado
        </h2>
        <p className="font-inter text-black/60 max-w-md mx-auto mb-8">
          Lo sentimos, el producto que buscás no existe o ya no está disponible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="inline-block px-8 py-4 bg-black text-white font-inter text-sm tracking-wide hover:bg-black/90 transition-colors"
          >
            Ver catálogo
          </Link>
          <Link
            href="/"
            className="inline-block px-8 py-4 border border-black text-black font-inter text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}