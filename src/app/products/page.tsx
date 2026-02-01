import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductGrid } from '@/components/features/ProductGrid'
import { Pagination } from '@/components/shared'
import {
  getCategories,
  getCategoriesWithProductCount,
  getProducts,
} from '@/lib/data'

export const metadata: Metadata = {
  title: 'Productos',
  description:
    'Explora nuestra colección de productos urbanos: Tattoo, Graffiti, Ropa, Accesorios y más.',
}

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

// ProductsPage: Lista todos los productos con paginacion.
// Tipo de renderizado: Dinamico (sin 'use cache').
// NOTA: Con cacheComponents, NO podemos usar 'use cache' cuando usamos searchParams
// porque searchParams es "dynamic request data" que no puede estar dentro de cache scope.
// La paginacion (?page=2) hace que cada combinacion sea unica.
// Las funciones de datos (getProducts, getCategories) SI pueden usar cache internamente.
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // SIN 'use cache' porque usamos searchParams
  // searchParams es Promise en Next.js 16, debe usar await
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = 12

  // Obtener datos
  const {
    data: products,
    totalPages,
    total,
  } = getProducts(
    undefined,
    { field: 'createdAt', order: 'desc' },
    { page, limit }
  )
  const categories = getCategories()
  const categoriesWithCount = getCategoriesWithProductCount()

  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">{total} productos disponibles</p>
        </div>

        {/* Categorias */}
        <section aria-labelledby="categories-section" className="mb-12">
          <h2 id="categories-section" className="mb-4 text-xl font-semibold">
            Categorías
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categoriesWithCount.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="hover:bg-accent border-border rounded-lg border p-3 text-center transition-colors"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-muted-foreground mt-1 block text-xs">
                  {category.productCount}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Grid de productos */}
        <section aria-labelledby="products-section">
          <h2 id="products-section" className="sr-only">
            Lista de productos
          </h2>
          <ProductGrid products={products} categories={categories} />

          {/* Paginacion */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/products"
          />
        </section>
      </div>
    </main>
  )
}
