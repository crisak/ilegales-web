import Link from 'next/link'

import { ProductCard } from '@/components/features/ProductCard'
import { Pagination } from '@/components/shared'
import type { Category, Product } from '@/types'

interface SearchResultsProps {
  products: Product[]
  categories: Category[]
  total: number
  currentPage: number
  totalPages: number
  query?: string
  baseUrl: string
}

// SearchResults: Muestra los resultados de busqueda.
// Server Component - recibe datos ya procesados.
// La paginacion usa links para SEO (aunque /search es SSR, los resultados son indexables).
export function SearchResults({
  products,
  categories,
  total,
  currentPage,
  totalPages,
  query,
  baseUrl,
}: SearchResultsProps) {
  // Crear mapa de categoryId -> slug
  const categorySlugMap = new Map(categories.map((c) => [c.id, c.slug]))

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        {query ? (
          <>
            <p className="text-muted-foreground mb-2 text-lg">
              No se encontraron productos para &ldquo;{query}&rdquo;
            </p>
            <p className="text-muted-foreground text-sm">
              Intenta con otros términos o{' '}
              <Link href="/products" className="text-primary hover:underline">
                explora nuestro catálogo
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground mb-2 text-lg">
              Ingresa un término de búsqueda para comenzar
            </p>
            <p className="text-muted-foreground text-sm">
              O{' '}
              <Link href="/products" className="text-primary hover:underline">
                explora todas las categorías
              </Link>
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Resumen */}
      <p className="text-muted-foreground mb-6 text-sm">
        {total} {total === 1 ? 'resultado' : 'resultados'}
        {query && (
          <>
            {' '}
            para &ldquo;<span className="text-foreground">{query}</span>&rdquo;
          </>
        )}
      </p>

      {/* Grid de resultados */}
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Resultados de búsqueda"
      >
        {products.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard
              product={product}
              categorySlug={
                categorySlugMap.get(product.categoryId) ?? 'unknown'
              }
            />
          </div>
        ))}
      </div>

      {/* Paginacion */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </div>
  )
}
