import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CollectionForm from "../../components/CollectionForm"

interface Props {
  params: Promise<{ slug: string }>
}

async function getCollectionBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("collections")
    .select(`
      *,
      product_collections (
        product_id
      )
    `)
    .eq("slug", slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    return { title: "Colección no encontrada | Admin KIREN" }
  }

  return {
    title: `Editar ${collection.name} | Admin KIREN`,
  }
}

export default async function EditCollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  // Extraer IDs de productos
  const initialProducts = collection.product_collections?.map((pc: any) => pc.product_id) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Editar Colección
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          {collection.name}
        </p>
      </div>

      <CollectionForm collection={collection} initialProducts={initialProducts} />
    </div>
  )
}
