"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ImageUploader from "./ImageUploader"

interface CollectionFormData {
  name: string
  slug: string
  description: string
  imageUrl: string | null
  isActive: boolean
  isFeatured: boolean
  displayOrder: number
  selectedProducts: string[]
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image_url?: string
}

interface CollectionFormProps {
  collection?: any
  initialProducts?: string[]
}

export default function CollectionForm({ collection, initialProducts = [] }: CollectionFormProps) {
  const router = useRouter()
  const isEditing = !!collection

  const [formData, setFormData] = useState<CollectionFormData>({
    name: collection?.name || "",
    slug: collection?.slug || "",
    description: collection?.description || "",
    imageUrl: collection?.image_url || null,
    isActive: collection?.is_active ?? true,
    isFeatured: collection?.is_featured ?? false,
    displayOrder: collection?.display_order || 0,
    selectedProducts: initialProducts,
  })

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar todos los productos
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products-list")
        const data = await response.json()
        setAllProducts(data.products || [])
      } catch (err) {
        console.error("Error loading products:", err)
      } finally {
        setIsLoadingProducts(false)
      }
    }
    loadProducts()
  }, [])

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

  const toggleProduct = (productId: string) => {
    setFormData({
      ...formData,
      selectedProducts: formData.selectedProducts.includes(productId)
        ? formData.selectedProducts.filter((id) => id !== productId)
        : [...formData.selectedProducts, productId],
    })
  }

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const endpoint = isEditing
        ? `/api/admin/collections/${collection.id}`
        : "/api/admin/collections"

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
          is_featured: formData.isFeatured,
          display_order: formData.displayOrder,
          product_ids: formData.selectedProducts,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar")
      }

      router.push("/admin/colecciones")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "PYG",
      minimumFractionDigits: 0,
    }).format(price)
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
                placeholder="Ej: Colección Verano 2026"
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
                placeholder="coleccion-verano-2026"
              />
              <p className="font-inter text-xs text-neutral-500 mt-1">
                URL: /coleccion/{formData.slug || "..."}
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
                placeholder="Descripción de la colección..."
              />
            </div>
          </div>

          {/* Product selector */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-oswald text-lg font-semibold text-neutral-900">
                Productos
              </h2>
              <span className="font-inter text-sm text-neutral-500">
                {formData.selectedProducts.length} seleccionados
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg font-inter text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
              />
            </div>

            {/* Product list */}
            <div className="max-h-96 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100">
              {isLoadingProducts ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto" />
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isSelected = formData.selectedProducts.includes(product.id)
                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        isSelected ? "bg-neutral-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProduct(product.id)}
                        className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                      />
                      <div className="w-10 h-12 bg-neutral-100 rounded overflow-hidden relative flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter text-sm font-medium text-neutral-900 truncate">
                          {product.name}
                        </p>
                        <p className="font-inter text-xs text-neutral-500">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </label>
                  )
                })
              ) : (
                <div className="p-8 text-center text-neutral-500 font-inter text-sm">
                  No se encontraron productos
                </div>
              )}
            </div>
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
              <span className="font-inter text-sm text-neutral-700">Activa (visible en tienda)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span className="font-inter text-sm text-neutral-700">Destacada (mostrar en home)</span>
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
              bucket="collections"
              folder={formData.slug || "temp"}
              label="Imagen de colección"
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
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear colección"}
        </button>
      </div>
    </form>
  )
}
