import type { Metadata } from 'next'

import {
  SearchBar,
  SearchFilters,
  SearchResults,
} from '@/components/features/Search'
import {
  getBrands,
  getCategories,
  getCategoriesWithProductCount,
  getCategoryBySlug,
  getProducts,
} from '@/lib/data'

// NOTA: Con cacheComponents: true, NO usamos export const dynamic = 'force-dynamic'.
// En su lugar, simplemente NO usamos 'use cache' en esta pagina.
// Sin 'use cache', la pagina es dinamica por defecto - se renderiza en cada request.
// Esto es ideal para busqueda donde los searchParams cambian constantemente.

export const metadata: Metadata = {
  title: 'Buscar',
  description:
    'Busca productos en ILEGALES - Tattoo, Graffiti, Ropa, Accesorios y más.',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}

// SearchPage: Pagina de busqueda con filtros.
// Tipo de renderizado: Dinamico (sin 'use cache' = SSR en cada request).
// Con cacheComponents: true, todo es dinamico por defecto.
// NO usamos 'use cache' aqui porque los searchParams cambian constantemente.
// Combina Server Components (resultados) con Client Components (SearchBar, filtros).
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // SIN 'use cache' = pagina dinamica, se renderiza en cada request
  // searchParams es Promise en Next.js 16
  const params = await searchParams
  const query = params.q ?? ''
  const categorySlug = params.category
  const brand = params.brand
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const page = Number(params.page) || 1
  const limit = 12

  // Obtener categoria si hay filtro
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined

  // Buscar productos
  const {
    data: products,
    totalPages,
    total,
  } = getProducts(
    {
      search: query || undefined,
      categoryId: category?.id,
      brand,
      minPrice,
      maxPrice,
    },
    { field: 'createdAt', order: 'desc' },
    { page, limit }
  )

  // Datos para los filtros
  const categories = getCategories()
  const categoriesWithCount = getCategoriesWithProductCount()
  const brands = getBrands()

  // Construir baseUrl preservando filtros actuales
  const buildBaseUrl = () => {
    const urlParams = new URLSearchParams()
    if (query) urlParams.set('q', query)
    if (categorySlug) urlParams.set('category', categorySlug)
    if (brand) urlParams.set('brand', brand)
    if (minPrice) urlParams.set('minPrice', minPrice.toString())
    if (maxPrice) urlParams.set('maxPrice', maxPrice.toString())

    const paramString = urlParams.toString()
    return paramString ? `/search?${paramString}` : '/search'
  }

  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header con SearchBar */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight">Buscar</h1>
          <div className="max-w-xl">
            <SearchBar initialQuery={query} placeholder="Buscar productos..." />
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar con filtros */}
          <SearchFilters
            categories={categoriesWithCount}
            brands={brands}
            selectedCategory={categorySlug}
            selectedBrand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />

          {/* Resultados */}
          <section aria-labelledby="search-results-heading">
            <h2 id="search-results-heading" className="sr-only">
              Resultados de búsqueda
            </h2>
            <SearchResults
              products={products}
              categories={categories}
              total={total}
              currentPage={page}
              totalPages={totalPages}
              query={query}
              baseUrl={buildBaseUrl()}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
