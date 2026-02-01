import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

import {
  LivePrice,
  ProductImages,
  ProductInfo,
  StockLevel,
} from '@/components/features/ProductDetail'
import { ProductCard } from '@/components/features/ProductCard'
import { Breadcrumbs } from '@/components/shared'
import { PriceSkeleton, StockSkeleton } from '@/components/ui'
import {
  getCategories,
  getCategoryBySlug,
  getProductBySlug,
  getProductWithCategory,
  getRelatedProducts,
} from '@/lib/data'
import { CACHE_TAGS } from '@/lib/constants/cache-tags'

// NOTA: Con cacheComponents: true, NO usamos export const revalidate ni dynamicParams.
// Esta pagina implementa PPR (Partial Prerendering):
// - El shell (ProductInfo, ProductImages) usa 'use cache' y se cachea.
// - Los holes (LivePrice, StockLevel) NO usan 'use cache' y se streaman dinamicamente.
// Las rutas no listadas en generateStaticParams se generan on-demand.

interface ProductPageProps {
  params: Promise<{
    category: string
    productId: string
  }>
}

// generateStaticParams: Pre-genera paginas de productos populares/destacados.
// En produccion, esto podria ser los top 100 productos mas vendidos.
export async function generateStaticParams() {
  const categories = getCategories()
  const params: { category: string; productId: string }[] = []

  // Generar params para algunos productos de cada categoria
  for (const category of categories) {
    const { data: products } = await import('@/lib/data').then((m) =>
      m.getProducts({ categoryId: category.id }, undefined, {
        page: 1,
        limit: 3,
      })
    )

    for (const product of products) {
      params.push({
        category: category.slug,
        productId: product.slug,
      })
    }
  }

  return params
}

// generateMetadata: Genera metadata dinamica para SEO.
// Incluye Open Graph para compartir en redes sociales.
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params
  const product = getProductBySlug(productId)

  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

// ProductPage: Detalle de producto con PPR (Partial Prerendering).
// 'use cache' marca el shell como cacheable (nombre, descripcion, imagenes).
// Los componentes LivePrice y StockLevel NO usan 'use cache',
// por lo que se renderizan como "holes" dinamicos con streaming.
export default async function ProductPage({ params }: ProductPageProps) {
  'use cache'

  const { category: categorySlug, productId } = await params

  // cacheLife con revalidate: 60 segundos, control granular del cache
  cacheLife({ revalidate: 60 })

  // cacheTag dinamico: Permite invalidar este producto especifico
  // con revalidateTag('product-spray-montana-94')
  cacheTag(CACHE_TAGS.PRODUCT(productId))

  // Validar que la categoria existe
  const category = getCategoryBySlug(categorySlug)
  if (!category) {
    notFound()
  }

  // Obtener producto con su categoria
  const product = getProductBySlug(productId)
  if (!product) {
    notFound()
  }

  // Validar que el producto pertenece a la categoria de la URL
  if (product.categoryId !== category.id) {
    notFound()
  }

  const productWithCategory = getProductWithCategory(product.id)
  if (!productWithCategory) {
    notFound()
  }

  // Obtener productos relacionados
  const relatedProducts = getRelatedProducts(product.id, 4)
  const categories = getCategories()
  const categorySlugMap = new Map(categories.map((c) => [c.id, c.slug]))

  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Productos', href: '/products' },
            { label: category.name, href: `/products/${categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Contenido principal */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Columna izquierda: Imagenes */}
          <ProductImages images={product.images} productName={product.name} />

          {/* Columna derecha: Info + Dinamicos */}
          <div className="space-y-8">
            {/* Info estatica (shell) */}
            <ProductInfo product={productWithCategory} />

            {/* Seccion de datos dinamicos */}
            <div className="border-border space-y-6 rounded-lg border p-6">
              <h2 className="text-lg font-semibold">Disponibilidad</h2>

              {/* LivePrice: Componente dinamico streameado */}
              {/* Suspense boundary permite mostrar skeleton mientras carga */}
              <Suspense fallback={<PriceSkeleton />}>
                <LivePrice productId={product.id} basePrice={product.price} />
              </Suspense>

              {/* StockLevel: Componente dinamico streameado */}
              <Suspense fallback={<StockSkeleton />}>
                <StockLevel productId={product.id} baseStock={product.stock} />
              </Suspense>

              {/* Boton de accion (simulado - sin carrito en este POC) */}
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                Agregar al carrito
              </button>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/573123574867?text=Hola! Me interesa el producto: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:bg-accent flex w-full items-center justify-center gap-2 rounded-md border px-6 py-3 text-sm font-medium transition-colors"
                aria-label="Consultar por WhatsApp (abre en nueva pestaña)"
              >
                💬 Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-16" aria-labelledby="related-products-heading">
            <h2
              id="related-products-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  categorySlug={
                    categorySlugMap.get(relatedProduct.categoryId) ?? 'unknown'
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
