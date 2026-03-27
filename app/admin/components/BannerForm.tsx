"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUploader from "./ImageUploader"

interface BannerFormData {
  type: "hero" | "promo" | "category"
  title: string
  subtitle: string
  description: string
  ctaText: string
  ctaLink: string
  imageUrl: string | null
  imageAlt: string
  displayOrder: number
  isActive: boolean
}

interface BannerFormProps {
  banner?: any
}

export default function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const isEditing = !!banner

  const [formData, setFormData] = useState<BannerFormData>({
    type: banner?.type || "hero",
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    description: banner?.description || "",
    ctaText: banner?.cta_text || "",
    ctaLink: banner?.cta_link || "",
    imageUrl: banner?.image_url || null,
    imageAlt: banner?.image_alt || "",
    displayOrder: banner?.display_order || 0,
    isActive: banner?.is_active ?? true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const endpoint = isEditing
        ? `/api/admin/banners/${banner.id}`
        : "/api/admin/banners"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title || null,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          cta_text: formData.ctaText || null,
          cta_link: formData.ctaLink || null,
          image_url: formData.imageUrl,
          image_alt: formData.imageAlt || null,
          display_order: formData.displayOrder,
          is_active: formData.isActive,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar")
      }

      router.push("/admin/banners")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-inter text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900">
              Información
            </h2>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Tipo de banner *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              >
                <option value="hero">Hero (Carrusel principal)</option>
                <option value="promo">Promoción</option>
                <option value="category">Categoría</option>
              </select>
            </div>

            {formData.type !== "hero" && (
              <>
                <div>
                  <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                    placeholder="Ej: Nueva Temporada"
                  />
                </div>

                <div>
                  <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                    placeholder="Ej: Promoción"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Descripción / Alt text
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black resize-none"
                placeholder="Descripción del banner o texto alternativo de la imagen"
              />
            </div>

            {formData.type !== "hero" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                    placeholder="Ej: Comprar ahora"
                  />
                </div>

                <div>
                  <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                    Link del botón
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                    placeholder="Ej: /catalogo"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span className="font-inter text-sm text-neutral-700">Activo</span>
            </label>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                min="0"
                className="w-24 px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              bucket="banners"
              folder={formData.type}
              label="Imagen del banner"
              aspectRatio={formData.type === "hero" ? "video" : "banner"}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 font-inter text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear banner"}
        </button>
      </div>
    </form>
  )
}
