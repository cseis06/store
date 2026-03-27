import { getAllCategories } from "@/lib/categories"
import ProductForm from "../components/ProductForm"

export const metadata = {
  title: "Nuevo Producto | Admin KIREN",
}

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Nuevo Producto
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          Crea un nuevo producto para tu tienda
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
