import type { Category, Product } from '@/types'

import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

// ProductGrid: Grid responsivo de productos.
// Server Component - renderiza una lista de ProductCards.
// Necesita las categorias para construir las URLs correctas.
export function ProductGrid({ products, categories }: ProductGridProps) {
  // Crear un mapa de categoryId -> slug para busqueda rapida
  const categorySlugMap = new Map(categories.map((c) => [c.id, c.slug]))

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No se encontraron productos.</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="Lista de productos"
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            categorySlug={categorySlugMap.get(product.categoryId) ?? 'unknown'}
          />
        </div>
      ))}
    </div>
  )
}
