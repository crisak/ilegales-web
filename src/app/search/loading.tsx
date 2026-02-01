import { ProductGridSkeleton, Skeleton } from '@/components/ui'

// loading.tsx: Skeleton UI para la pagina de busqueda.
// Se muestra durante navegacion y mientras se procesan filtros.
export default function SearchLoading() {
  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-9 w-32" />
          <div className="max-w-xl">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        {/* Layout de dos columnas */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>

            {/* Filtro categoria */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Filtro marca */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Filtro precio */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-14" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>
          </div>

          {/* Resultados skeleton */}
          <div>
            <Skeleton className="mb-6 h-5 w-40" />
            <ProductGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </main>
  )
}
