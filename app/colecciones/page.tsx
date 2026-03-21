import { Metadata } from "next"
import { getAllCollections } from "@/lib/collections"
import CollectionsGrid from "./CollectionsGrid"

export const metadata: Metadata = {
  title: "Colecciones | KIREN",
  description: "Explorá nuestras colecciones diseñadas con un enfoque minimalista y atemporal.",
}

export default async function ColeccionesPage() {
  const collections = await getAllCollections()

  // Separar colecciones destacadas y regulares
  const featuredCollections = collections.filter((c) => c.isFeatured)
  const regularCollections = collections.filter((c) => !c.isFeatured)

  return (
    <CollectionsGrid 
      featuredCollections={featuredCollections}
      regularCollections={regularCollections}
    />
  )
}
