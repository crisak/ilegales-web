import Image from 'next/image'
import Link from 'next/link'

import type { CategoryWithProductCount } from '@/types'

interface CategoryCardProps {
  category: CategoryWithProductCount
}

// CategoryCard: Tarjeta para mostrar categorias destacadas.
// Server Component - no requiere interactividad.
// Muestra imagen, nombre, descripcion y conteo de productos.
export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="group">
      <Link
        href={`/products/${category.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label={`Ver categoria ${category.name}`}
      >
        {/* Imagen */}
        <div className="bg-card border-border relative aspect-[4/3] overflow-hidden rounded-lg border">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Contenido */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-lg font-bold text-white">{category.name}</h3>
            <p className="text-sm text-white/80">
              {category.productCount} productos
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
