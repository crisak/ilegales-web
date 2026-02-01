import Link from 'next/link'

import { CategoryCard } from '@/components/features/CategoryCard'
import { ProductCard } from '@/components/features/ProductCard'
import {
  getCategories,
  getCategoriesWithProductCount,
  getFeaturedProducts,
} from '@/lib/data'

// Esta es la pagina de inicio (SSG - Static Site Generation).
// Se genera en build time y se sirve como HTML estatico.
// Ideal para contenido que no cambia frecuentemente (hero, categorias destacadas).
// Los productos destacados usan ISR implicitamente a traves de los datos.

export default function HomePage() {
  // Obtener datos directamente (Server Component)
  // No necesitamos fetch porque es mock data local
  const categoriesWithCount = getCategoriesWithProductCount()
  const featuredProducts = getFeaturedProducts(8)
  const categories = getCategories()

  // Crear mapa de categoryId -> slug para ProductCard
  const categorySlugMap = new Map(categories.map((c) => [c.id, c.slug]))

  return (
    <main id="main-content" className="flex-1">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Background con gradiente */}
        <div className="from-background via-background/95 to-background/80 absolute inset-0 bg-gradient-to-b" />

        {/* Patrón de fondo (simulando textura urbana) */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1
            id="hero-heading"
            className="mb-4 text-5xl font-black tracking-tighter uppercase sm:text-6xl md:text-7xl lg:text-8xl"
          >
            ILEGALES
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
            Tienda Urbana • Tattoo • Graffiti • Galería • Artículos y Accesorios
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Ver Productos
            </Link>
            <Link
              href="/search"
              className="border-border bg-background hover:bg-accent inline-flex items-center justify-center rounded-md border px-8 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Buscar
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias Destacadas */}
      <section
        className="container mx-auto px-4 py-16"
        aria-labelledby="categories-heading"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2
            id="categories-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Categorías
          </h2>
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesWithCount.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="bg-card/50 py-16" aria-labelledby="featured-heading">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2
              id="featured-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Productos Destacados
            </h2>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
            aria-label="Productos destacados"
          >
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="container mx-auto px-4 py-16 text-center"
        aria-labelledby="cta-heading"
      >
        <h2
          id="cta-heading"
          className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
        >
          ¿Tienes preguntas?
        </h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-xl">
          Estamos aquí para ayudarte. Contáctanos por WhatsApp y te asesoramos
          en lo que necesites.
        </p>
        <a
          href="https://wa.me/573123574867"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Contactar por WhatsApp (abre en nueva pestaña)"
        >
          Contactar por WhatsApp
        </a>
      </section>
    </main>
  )
}
