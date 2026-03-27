import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

async function getCollections() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("collections")
    .select(`
      *,
      product_collections (count)
    `)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }

  return data || []
}

export default async function AdminCollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            Colecciones
          </h1>
          <p className="font-inter text-neutral-500 mt-1">
            {collections.length} colecciones en total
          </p>
        </div>
        <Link
          href="/admin/colecciones/nueva"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva colección
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.length > 0 ? (
          collections.map((collection: any) => (
            <Link
              key={collection.id}
              href={`/admin/colecciones/${collection.slug}`}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-colors group"
            >
              <div className="aspect-video bg-neutral-100 relative">
                {collection.image_url ? (
                  <Image
                    src={collection.image_url}
                    alt={collection.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                    </svg>
                  </div>
                )}
                {collection.is_featured && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-0.5 text-[10px] font-inter font-medium rounded">
                    Destacada
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-inter font-medium text-neutral-900 group-hover:text-black">
                      {collection.name}
                    </h3>
                    <p className="font-inter text-xs text-neutral-500 mt-0.5">
                      /{collection.slug}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    collection.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {collection.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
              </svg>
            </div>
            <p className="font-inter text-neutral-500 mb-4">No hay colecciones todavía</p>
            <Link
              href="/admin/colecciones/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg"
            >
              Crear primera colección
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
