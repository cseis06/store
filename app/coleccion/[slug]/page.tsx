import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCollectionBySlug, getAllCollectionSlugs } from "@/lib/collections"
import CollectionContent from "./CollectionContent"

interface Props {
  params: Promise<{ slug: string }>
}

// Generar páginas estáticas para todas las colecciones
export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Metadata dinámica
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    return {
      title: "Colección no encontrada | KIREN",
    }
  }

  return {
    title: `${collection.name} | KIREN`,
    description: collection.description || `Descubrí nuestra colección ${collection.name}`,
    openGraph: {
      title: `${collection.name} | KIREN`,
      description: collection.description || `Descubrí nuestra colección ${collection.name}`,
      images: collection.bannerUrl ? [collection.bannerUrl] : [],
    },
  }
}

export default async function ColeccionPage({ params }: Props) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  return <CollectionContent collection={collection} />
}
