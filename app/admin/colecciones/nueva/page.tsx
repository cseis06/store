import CollectionForm from "../../components/CollectionForm"

export const metadata = {
  title: "Nueva Colección | Admin KIREN",
}

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Nueva Colección
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          Crea una nueva colección de productos
        </p>
      </div>

      <CollectionForm />
    </div>
  )
}
