'use client'

// 'use client': Este componente necesita event handlers para los filtros.
// Actualiza la URL con los filtros seleccionados.

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

import type { CategoryWithProductCount } from '@/types'

interface SearchFiltersProps {
  categories: CategoryWithProductCount[]
  brands: string[]
  selectedCategory?: string
  selectedBrand?: string
  minPrice?: number
  maxPrice?: number
}

// SearchFilters: Filtros de busqueda interactivos.
// Client Component porque necesita manejar cambios y actualizar la URL.
export function SearchFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
}: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Helper para actualizar un parametro de URL
  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }

        // Resetear pagina al cambiar filtros
        params.delete('page')

        router.push(`/search?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  // Limpiar todos los filtros
  const clearFilters = useCallback(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      const query = params.get('q')

      // Mantener solo la query
      const newParams = new URLSearchParams()
      if (query) {
        newParams.set('q', query)
      }

      router.push(`/search?${newParams.toString()}`)
    })
  }, [router, searchParams])

  const hasFilters = selectedCategory || selectedBrand || minPrice || maxPrice

  return (
    <aside aria-label="Filtros de búsqueda">
      <div className="space-y-6">
        {/* Header con boton limpiar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtros</h2>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              disabled={isPending}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtro por categoria */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Categoría</h3>
          <select
            value={selectedCategory ?? ''}
            onChange={(e) => updateFilter('category', e.target.value || null)}
            className="bg-input border-border focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            aria-label="Filtrar por categoría"
            disabled={isPending}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat.productCount})
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por marca */}
        {brands.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Marca</h3>
            <select
              value={selectedBrand ?? ''}
              onChange={(e) => updateFilter('brand', e.target.value || null)}
              className="bg-input border-border focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              aria-label="Filtrar por marca"
              disabled={isPending}
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtro por precio */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Precio</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice ?? ''}
              onChange={(e) => updateFilter('minPrice', e.target.value || null)}
              className="bg-input border-border focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              aria-label="Precio mínimo"
              min={0}
              disabled={isPending}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice ?? ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
              className="bg-input border-border focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              aria-label="Precio máximo"
              min={0}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Indicador de carga */}
        {isPending && (
          <p className="text-muted-foreground text-center text-sm">
            Actualizando...
          </p>
        )}
      </div>
    </aside>
  )
}
