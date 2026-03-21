import { Metadata } from "next"
import { getProducts } from "@/lib/products"
import { getAllCategories } from "@/lib/categories"
import CatalogContent from "./CatalogContent"

export const metadata: Metadata = {
  title: "Catálogo | KIREN",
  description: "Explorá nuestra colección completa de piezas minimalistas diseñadas para el día a día.",
}

export default async function CatalogoPage() {
  // Fetch inicial de datos
  const [productsResponse, categories] = await Promise.all([
    getProducts({ limit: 24 }),
    getAllCategories(),
  ])

  return (
    <CatalogContent
      initialProducts={productsResponse.data}
      initialCount={productsResponse.count}
      categories={categories}
    />
  )
}
