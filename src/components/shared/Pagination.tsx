import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

// Pagination: Componente de paginacion accesible.
// Server Component - no necesita estado del cliente.
// Usa navegacion con links para SEO y permite que las paginas se indexen.
export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  // No mostrar paginacion si solo hay una pagina
  if (totalPages <= 1) return null

  // Calcular rango de paginas a mostrar (max 5)
  const getPageNumbers = (): number[] => {
    const pages: number[] = []
    const maxVisible = 5

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    // Ajustar si estamos cerca del final
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Helper para construir URL con page param
  const getPageUrl = (page: number): string => {
    const url = new URL(baseUrl, 'http://localhost')
    if (page > 1) {
      url.searchParams.set('page', page.toString())
    } else {
      url.searchParams.delete('page')
    }
    return `${url.pathname}${url.search}`
  }

  return (
    <nav aria-label="Paginación de productos" className="mt-8">
      <ul className="flex items-center justify-center gap-1">
        {/* Anterior */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className="hover:bg-accent flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
              aria-label="Ir a página anterior"
            >
              ← Anterior
            </Link>
          ) : (
            <span
              className="text-muted-foreground flex h-10 cursor-not-allowed items-center justify-center px-4 text-sm"
              aria-disabled="true"
            >
              ← Anterior
            </span>
          )}
        </li>

        {/* Primera pagina + ellipsis */}
        {pageNumbers[0] !== undefined && pageNumbers[0] > 1 && (
          <>
            <li>
              <Link
                href={getPageUrl(1)}
                className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors"
                aria-label="Ir a página 1"
              >
                1
              </Link>
            </li>
            {pageNumbers[0] > 2 && (
              <li>
                <span className="text-muted-foreground flex h-10 w-10 items-center justify-center text-sm">
                  ...
                </span>
              </li>
            )}
          </>
        )}

        {/* Numeros de pagina */}
        {pageNumbers.map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span
                className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium"
                aria-current="page"
              >
                {page}
              </span>
            ) : (
              <Link
                href={getPageUrl(page)}
                className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors"
                aria-label={`Ir a página ${page}`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}

        {/* Ultima pagina + ellipsis */}
        {pageNumbers[pageNumbers.length - 1] !== undefined &&
          pageNumbers[pageNumbers.length - 1]! < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1]! < totalPages - 1 && (
                <li>
                  <span className="text-muted-foreground flex h-10 w-10 items-center justify-center text-sm">
                    ...
                  </span>
                </li>
              )}
              <li>
                <Link
                  href={getPageUrl(totalPages)}
                  className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors"
                  aria-label={`Ir a página ${totalPages}`}
                >
                  {totalPages}
                </Link>
              </li>
            </>
          )}

        {/* Siguiente */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className="hover:bg-accent flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
              aria-label="Ir a página siguiente"
            >
              Siguiente →
            </Link>
          ) : (
            <span
              className="text-muted-foreground flex h-10 cursor-not-allowed items-center justify-center px-4 text-sm"
              aria-disabled="true"
            >
              Siguiente →
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
