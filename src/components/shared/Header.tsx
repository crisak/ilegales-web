import Link from 'next/link'

// Header: Componente de navegacion principal.
// Es un Server Component porque no necesita interactividad.
// Contiene navegacion semantica con <nav> para accesibilidad.
export function Header() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter transition-opacity hover:opacity-80"
          aria-label="ILEGALES - Ir al inicio"
        >
          ILEGALES
        </Link>

        {/* Navegacion principal */}
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                Buscar
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
