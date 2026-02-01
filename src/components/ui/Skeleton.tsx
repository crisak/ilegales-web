import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

// Skeleton: Componente de loading placeholder.
// Usa animacion de pulso para indicar que el contenido esta cargando.
// Importante para UX - el usuario sabe que algo esta por aparecer.
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('bg-muted animate-pulse rounded-md', className)}
      aria-hidden="true"
    />
  )
}

// ProductCardSkeleton: Skeleton especifico para ProductCard
export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Imagen */}
      <Skeleton className="aspect-square w-full rounded-lg" />
      {/* Marca */}
      <Skeleton className="h-3 w-16" />
      {/* Nombre */}
      <Skeleton className="h-4 w-3/4" />
      {/* Precio */}
      <Skeleton className="h-5 w-24" />
    </div>
  )
}

// ProductGridSkeleton: Skeleton para el grid de productos
export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Cargando productos..."
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// CategoryCardSkeleton: Skeleton para CategoryCard
export function CategoryCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
    </div>
  )
}

// PriceSkeleton: Skeleton para el componente LivePrice
export function PriceSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Cargando precio...">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-3 w-48" />
    </div>
  )
}

// StockSkeleton: Skeleton para el componente StockLevel
export function StockSkeleton() {
  return (
    <div className="space-y-2" role="status" aria-label="Cargando stock...">
      <Skeleton className="h-8 w-32 rounded-full" />
      <Skeleton className="h-3 w-40" />
    </div>
  )
}
