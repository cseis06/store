"use client"

import { useState } from "react"
import { Category } from "@/lib/categories"

export interface FilterState {
  category: string | null
  priceRange: string | null
  sortBy: string
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void
  activeFilters: FilterState
  categories: Category[]
}

const priceRanges = [
  { value: "0-30000", label: "Hasta Gs. 30.000" },
  { value: "30000-60000", label: "Gs. 30.000 - 60.000" },
  { value: "60000-100000", label: "Gs. 60.000 - 100.000" },
  { value: "100000+", label: "Más de Gs. 100.000" },
]

const sortOptions = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "A - Z" },
]

export default function CatalogFilters({ 
  onFilterChange, 
  activeFilters,
  categories 
}: FiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleCategoryChange = (slug: string | null) => {
    onFilterChange({
      ...activeFilters,
      category: activeFilters.category === slug ? null : slug,
    })
  }

  const handlePriceChange = (value: string | null) => {
    onFilterChange({
      ...activeFilters,
      priceRange: activeFilters.priceRange === value ? null : value,
    })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      sortBy: value,
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: null,
      priceRange: null,
      sortBy: "newest",
    })
  }

  const hasActiveFilters = activeFilters.category || activeFilters.priceRange

  return (
    <>
      {/* Botón de filtros móvil */}
      <div className="lg:hidden flex items-center justify-between mb-6">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-inter text-sm text-black/70 hover:text-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          Filtros
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-black rounded-full" />
          )}
        </button>

        {/* Ordenar móvil */}
        <select
          value={activeFilters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="font-inter text-sm text-black/70 bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Panel de filtros móvil */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-oswald text-xl font-semibold">Filtros</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-black/60 hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <FilterContent
              activeFilters={activeFilters}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onSortChange={handleSortChange}
            />

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-8 py-4 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}

      {/* Filtros desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-32">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-oswald text-lg font-semibold">Filtros</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="font-inter text-xs text-black/50 hover:text-black transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          <FilterContent
            activeFilters={activeFilters}
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
          />
        </div>
      </aside>
    </>
  )
}

// Componente interno con el contenido de los filtros
function FilterContent({
  activeFilters,
  categories,
  onCategoryChange,
  onPriceChange,
  onSortChange,
}: {
  activeFilters: FilterState
  categories: Category[]
  onCategoryChange: (slug: string | null) => void
  onPriceChange: (value: string | null) => void
  onSortChange: (value: string) => void
}) {
  return (
    <div className="space-y-8">
      {/* Ordenar (solo desktop) */}
      <div className="hidden lg:block">
        <h4 className="font-inter text-xs font-medium uppercase tracking-wider text-black/50 mb-4">
          Ordenar por
        </h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`block w-full text-left font-inter text-sm py-1 transition-colors ${
                activeFilters.sortBy === option.value
                  ? "text-black font-medium"
                  : "text-black/60 hover:text-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categorías (dinámicas desde Supabase) */}
      {categories.length > 0 && (
        <div>
          <h4 className="font-inter text-xs font-medium uppercase tracking-wider text-black/50 mb-4">
            Categoría
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={`block w-full text-left font-inter text-sm py-1 transition-colors ${
                  activeFilters.category === category.slug
                    ? "text-black font-medium"
                    : "text-black/60 hover:text-black"
                }`}
              >
                {category.name}
                {category.productCount !== undefined && (
                  <span className="text-black/30 ml-1">
                    ({category.productCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Precio */}
      <div>
        <h4 className="font-inter text-xs font-medium uppercase tracking-wider text-black/50 mb-4">
          Precio
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onPriceChange(range.value)}
              className={`block w-full text-left font-inter text-sm py-1 transition-colors ${
                activeFilters.priceRange === range.value
                  ? "text-black font-medium"
                  : "text-black/60 hover:text-black"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
