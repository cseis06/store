import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import BannerForm from "../../components/BannerForm"

interface Props {
  params: Promise<{ id: string }>
}

async function getBannerById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const banner = await getBannerById(id)

  if (!banner) {
    return { title: "Banner no encontrado | Admin KIREN" }
  }

  return {
    title: `Editar Banner | Admin KIREN`,
  }
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params
  const banner = await getBannerById(id)

  if (!banner) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
          Editar Banner
        </h1>
        <p className="font-inter text-neutral-500 mt-1">
          {banner.title || `Banner ${banner.type}`}
        </p>
      </div>

      <BannerForm banner={banner} />
    </div>
  )
}
