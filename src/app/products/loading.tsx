import { ProductGridSkeleton, Skeleton } from '@/components/ui'

// loading.tsx: Skeleton UI mostrado mientras la pagina carga.
// Next.js automaticamente muestra este componente durante navegacion.
// Mejora UX al dar feedback visual inmediato al usuario.
export default function ProductsLoading() {
  return (
    <main id="main-content" className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Categorias skeleton */}
        <section className="mb-12">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </section>

        {/* Products grid skeleton */}
        <ProductGridSkeleton count={12} />
      </div>
    </main>
  )
}
