import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAllCategories } from "@/lib/categories"
import ProductForm from "../../components/ProductForm"

interface Props {
  params: Promise<{ slug: string }>
}

async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        url,
        is_primary,
        display_order
      )
    `)
    .eq("slug", slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Producto no encontrado | Admin KIREN" }
  }

  return {
    title: `Editar ${product.name} | Admin KIREN`,
  }
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params
  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getAllCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Editar Producto
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          {product.name}
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
