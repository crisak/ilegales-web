import Image from 'next/image'
import Link from 'next/link'

import { formatPrice } from '@/lib/utils/format'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  categorySlug: string
}

// ProductCard: Tarjeta de producto para grids y listados.
// Es un Server Component - no necesita interactividad.
// Usa Next.js Image para optimizacion automatica.
export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const productUrl = `/products/${categorySlug}/${product.slug}`

  return (
    <article className="group">
      <Link
        href={productUrl}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label={`Ver ${product.name}`}
      >
        {/* Imagen */}
        <div className="bg-card border-border relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={product.images[0] ?? '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-xs font-semibold">
                NUEVO
              </span>
            )}
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  OFERTA
                </span>
              )}
          </div>

          {/* Stock badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-sm font-semibold text-white">AGOTADO</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          {/* Marca */}
          {product.brand && (
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              {product.brand}
            </p>
          )}

          {/* Nombre */}
          <h3 className="group-hover:text-primary/80 line-clamp-2 text-sm font-medium transition-colors">
            {product.name}
          </h3>

          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <span className="text-muted-foreground text-sm line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
          </div>
        </div>
      </Link>
    </article>
  )
}
