"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUploader from "./ImageUploader"

interface CategoryFormData {
  name: string
  slug: string
  description: string
  imageUrl: string | null
  isActive: boolean
  displayOrder: number
}

interface CategoryFormProps {
  category?: any
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    imageUrl: category?.image_url || null,
    isActive: category?.is_active ?? true,
    displayOrder: category?.display_order || 0,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      slug: isEditing ? formData.slug : generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const endpoint = isEditing
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          image_url: formData.imageUrl,
          is_active: formData.isActive,
          display_order: formData.displayOrder,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar")
      }

      router.push("/admin/categorias")
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
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                placeholder="Ej: Remeras"
              />
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                placeholder="remeras"
              />
              <p className="font-inter text-xs text-neutral-500 mt-1">
                URL: /categoria/{formData.slug || "..."}
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black resize-none"
                placeholder="Descripción de la categoría..."
              />
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Orden de visualización
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                min="0"
                className="w-32 px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span className="font-inter text-sm text-neutral-700">Activa (visible en tienda)</span>
            </label>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              bucket="categories"
              folder={formData.slug || "temp"}
              label="Imagen de categoría"
              aspectRatio="video"
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
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear categoría"}
        </button>
      </div>
    </form>
  )
}
