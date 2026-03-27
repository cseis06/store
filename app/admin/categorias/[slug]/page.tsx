import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CategoryForm from "../../components/CategoryForm"

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return { title: "Categoría no encontrada | Admin KIREN" }
  }

  return {
    title: `Editar ${category.name} | Admin KIREN`,
  }
}

export default async function EditCategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Editar Categoría
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          {category.name}
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
