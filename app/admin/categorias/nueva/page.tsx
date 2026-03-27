import CategoryForm from "../../components/CategoryForm"

export const metadata = {
  title: "Nueva Categoría | Admin KIREN",
}

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Nueva Categoría
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          Crea una nueva categoría de productos
        </p>
      </div>

      <CategoryForm />
    </div>
  )
}
