import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

async function getBanners() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("type", { ascending: true })
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching banners:", error)
    return []
  }

  return data || []
}

const typeLabels: Record<string, string> = {
  hero: "Hero (Carrusel)",
  promo: "Promoción",
  category: "Categoría",
}

export default async function AdminBannersPage() {
  const banners = await getBanners()

  // Agrupar por tipo
  const heroSlides = banners.filter((b: any) => b.type === "hero")
  const promoBanners = banners.filter((b: any) => b.type === "promo")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            Banners
          </h1>
          <p className="font-inter text-neutral-500 mt-1">
            Gestiona los banners del home
          </p>
        </div>
        <Link
          href="/admin/banners/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo banner
        </Link>
      </div>

      {/* Hero Slides */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
          Hero (Carrusel principal)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroSlides.length > 0 ? (
            heroSlides.map((banner: any, index: number) => (
              <Link
                key={banner.id}
                href={`/admin/banners/${banner.id}`}
                className="group relative aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.image_alt || `Slide ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs font-inter rounded">
                  Slide {index + 1}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white text-black px-3 py-1.5 rounded text-xs font-inter">
                    Editar
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-neutral-500 font-inter text-sm">
              No hay slides en el carrusel
            </div>
          )}
        </div>
      </div>

      {/* Promo Banners */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
          Banners de Promoción
        </h2>
        <div className="space-y-4">
          {promoBanners.length > 0 ? (
            promoBanners.map((banner: any) => (
              <Link
                key={banner.id}
                href={`/admin/banners/${banner.id}`}
                className="flex gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="w-40 h-20 bg-neutral-200 rounded overflow-hidden relative flex-shrink-0">
                  {banner.image_url && (
                    <Image
                      src={banner.image_url}
                      alt={banner.title || "Banner"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-inter font-medium text-neutral-900">
                    {banner.title || "(Sin título)"}
                  </h3>
                  {banner.subtitle && (
                    <p className="font-inter text-sm text-neutral-500">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.cta_link && (
                    <p className="font-inter text-xs text-neutral-400 mt-1">
                      Link: {banner.cta_link}
                    </p>
                  )}
                </div>
                <span className={`self-start px-2 py-1 text-xs font-medium rounded ${
                  banner.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-neutral-100 text-neutral-600"
                }`}>
                  {banner.is_active ? "Activo" : "Inactivo"}
                </span>
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-neutral-500 font-inter text-sm">
              No hay banners de promoción
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
