import {
  PriceSkeleton,
  ProductCardSkeleton,
  Skeleton,
  StockSkeleton,
} from '@/components/ui'

// loading.tsx: Skeleton UI para la pagina de detalle de producto.
// Se muestra durante la navegacion inicial.
// Los componentes dinamicos tienen sus propios skeletons via Suspense.
export default function ProductDetailLoading() {
  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs skeleton */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Contenido principal */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imagen principal skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            {/* Categoria badge */}
            <Skeleton className="h-6 w-24 rounded-full" />

            {/* Nombre */}
            <Skeleton className="h-10 w-3/4" />

            {/* Marca */}
            <Skeleton className="h-4 w-20" />

            {/* Precio */}
            <Skeleton className="h-9 w-32" />

            {/* Descripcion corta */}
            <Skeleton className="h-6 w-full" />

            {/* Descripcion */}
            <div className="space-y-2 pt-6">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>

            {/* Seccion dinamica skeleton */}
            <div className="border-border space-y-6 rounded-lg border p-6">
              <Skeleton className="h-6 w-32" />
              <PriceSkeleton />
              <StockSkeleton />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Productos relacionados skeleton */}
        <div className="mt-16">
          <Skeleton className="mb-6 h-8 w-56" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
