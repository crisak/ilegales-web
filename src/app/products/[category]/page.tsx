import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/features/ProductGrid'
import { Breadcrumbs, Pagination } from '@/components/shared'
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/data'

// NOTA: Con cacheComponents: true, NO usamos export const revalidate ni dynamicParams.
// Esta pagina es DINAMICA porque usa searchParams (paginacion, subcategoria).
// No podemos usar 'use cache' cuando accedemos a searchParams.
// Las rutas no listadas en generateStaticParams se generan on-demand.

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    page?: string
    subcategory?: string
  }>
}

// generateStaticParams: Pre-genera las paginas de categorias conocidas en build time.
// Mejora performance inicial y SEO al tener HTML listo.
export async function generateStaticParams() {
  const categories = getCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

// generateMetadata: Genera metadata dinamica basada en la categoria.
// Importante para SEO - cada categoria tiene title y description unicos.
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: category.name,
    description: category.description,
  }
}

// CategoryPage: Muestra productos filtrados por categoria.
// Tipo de renderizado: Dinamico (sin 'use cache').
// NOTA: No podemos usar 'use cache' porque accedemos a searchParams.
// searchParams contiene datos dinamicos (page, subcategory) que cambian en cada request.
// Las funciones de datos (getProducts, getCategoryBySlug) pueden usar cache internamente.
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  // SIN 'use cache' porque usamos searchParams
  // params y searchParams son Promise en Next.js 16
  const { category: categorySlug } = await params
  const { page: pageParam, subcategory } = await searchParams

  const page = Number(pageParam) || 1
  const limit = 12

  // Obtener categoria
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  // Obtener productos de esta categoria
  const {
    data: products,
    totalPages,
    total,
  } = getProducts(
    {
      categoryId: category.id,
      subcategoryId: subcategory,
    },
    { field: 'createdAt', order: 'desc' },
    { page, limit }
  )

  const categories = getCategories()

  // Construir baseUrl para paginacion (preservando subcategory si existe)
  const baseUrl = subcategory
    ? `/products/${categorySlug}?subcategory=${subcategory}`
    : `/products/${categorySlug}`

  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Productos', href: '/products' },
            { label: category.name },
          ]}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            {category.name}
          </h1>
          <p className="text-muted-foreground">{category.description}</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {total} productos encontrados
          </p>
        </div>

        {/* Subcategorias */}
        {category.subcategories.length > 0 && (
          <section aria-labelledby="subcategories-heading" className="mb-8">
            <h2 id="subcategories-heading" className="sr-only">
              Filtrar por subcategoría
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/products/${categorySlug}`}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  !subcategory
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                Todos
              </Link>
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/products/${categorySlug}?subcategory=${sub.slug}`}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    subcategory === sub.slug
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Grid de productos */}
        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="sr-only">
            Productos en {category.name}
          </h2>

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} categories={categories} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay productos en esta categoría.
              </p>
              <Link
                href="/products"
                className="text-primary mt-4 inline-block hover:underline"
              >
                Ver todos los productos
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
