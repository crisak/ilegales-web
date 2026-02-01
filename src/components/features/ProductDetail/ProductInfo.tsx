import { formatPrice } from '@/lib/utils/format'
import type { ProductWithCategory } from '@/types'

interface ProductInfoProps {
  product: ProductWithCategory
}

// ProductInfo: Informacion estatica del producto (nombre, descripcion, etc.)
// Server Component que forma parte del "shell estatico" en PPR.
// Este contenido se renderiza en build/ISR y se sirve instantaneamente.
export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Categoria y Subcategoria */}
      <div className="flex items-center gap-2">
        <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium">
          {product.category.name}
        </span>
        {product.subcategory && (
          <span className="text-muted-foreground text-xs">
            {product.subcategory.name}
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {product.isNew && (
          <span className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-semibold">
            NUEVO
          </span>
        )}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            OFERTA
          </span>
        )}
      </div>

      {/* Nombre */}
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        {product.name}
      </h1>

      {/* Marca */}
      {product.brand && (
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          {product.brand}
        </p>
      )}

      {/* Precio estatico (referencia) */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-muted-foreground text-lg line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Descripcion corta */}
      <p className="text-muted-foreground text-lg">
        {product.shortDescription}
      </p>

      {/* Descripcion completa */}
      <div className="border-border border-t pt-6">
        <h2 className="mb-3 text-lg font-semibold">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="border-border border-t pt-6">
          <h2 className="mb-3 text-lg font-semibold">Etiquetas</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SKU */}
      <div className="text-muted-foreground pt-4 text-xs">
        SKU: {product.sku}
      </div>
    </div>
  )
}
