import BannerForm from "../../components/BannerForm"

export const metadata = {
  title: "Nuevo Banner | Admin KIREN",
}

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Nuevo Banner
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          Crea un nuevo banner para el home
        </p>
      </div>

      <BannerForm />
    </div>
  )
}
