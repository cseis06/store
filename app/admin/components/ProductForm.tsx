"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUploader from "./ImageUploader"
import type { Category } from "@/lib/categories"

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isOnSale: boolean
  imageUrl: string | null
}

interface ProductFormProps {
  product?: any
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    compareAtPrice: product?.compare_at_price || null,
    categoryId: product?.category_id || "",
    isActive: product?.is_active ?? true,
    isFeatured: product?.is_featured ?? false,
    isNew: product?.is_new ?? false,
    isOnSale: product?.is_on_sale ?? false,
    imageUrl: product?.product_images?.find((img: any) => img.is_primary)?.url || null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generar slug automáticamente desde el nombre
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
        ? `/api/admin/products/${product.id}` 
        : "/api/admin/products"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          price: formData.price,
          compare_at_price: formData.compareAtPrice,
          category_id: formData.categoryId || null,
          is_active: formData.isActive,
          is_featured: formData.isFeatured,
          is_new: formData.isNew,
          is_on_sale: formData.isOnSale,
          image_url: formData.imageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el producto")
      }

      router.push("/admin/productos")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-inter text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información básica */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900">
              Información básica
            </h2>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Nombre del producto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                placeholder="Ej: Remera Essential"
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
                placeholder="remera-essential"
              />
              <p className="font-inter text-xs text-neutral-500 mt-1">
                URL: /producto/{formData.slug || "..."}
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black resize-none"
                placeholder="Describe el producto..."
              />
            </div>
          </div>

          {/* Precios */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900">
              Precios
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                  Precio (Gs.) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block font-inter text-sm font-medium text-neutral-700 mb-1">
                  Precio anterior (Gs.)
                </label>
                <input
                  type="number"
                  value={formData.compareAtPrice || ""}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : null })}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                  placeholder="Para mostrar descuento"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900">
              Estado
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="font-inter text-sm text-neutral-700">Activo (visible en tienda)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="font-inter text-sm text-neutral-700">Destacado</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="font-inter text-sm text-neutral-700">Nuevo</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="font-inter text-sm text-neutral-700">En oferta</span>
              </label>
            </div>
          </div>

          {/* Categoría */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900">
              Categoría
            </h2>

            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen principal */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              bucket="products"
              folder={formData.slug || "temp"}
              label="Imagen principal"
              aspectRatio="portrait"
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
          className="px-6 py-2.5 bg-black text-white font-inter text-sm hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  )
}
