import { ProductGridSkeleton, Skeleton } from '@/components/ui'

// loading.tsx: Skeleton UI para la pagina de categoria.
// Se muestra automaticamente durante la navegacion.
export default function CategoryLoading() {
  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs skeleton */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="mb-2 h-5 w-96" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Subcategorias skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Products grid skeleton */}
        <ProductGridSkeleton count={12} />
      </div>
    </main>
  )
}
