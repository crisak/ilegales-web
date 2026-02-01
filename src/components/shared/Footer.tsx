import Link from 'next/link'
import { CurrentYear } from './CurrentYear'

// Footer: Componente de pie de pagina.
// Server Component - solo contenido estatico.
// Incluye informacion de contacto y enlaces utiles.
// NOTA: El año actual se obtiene via Client Component (CurrentYear)
// porque new Date() no es compatible con cacheComponents en Server Components.
export function Footer() {
  return (
    <footer className="border-border/40 mt-auto border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Marca */}
          <div>
            <h2 className="mb-3 text-lg font-bold tracking-tighter">
              ILEGALES
            </h2>
            <p className="text-muted-foreground text-sm">
              Tienda Urbana - Tattoo, Graffiti, Galería, Artículos y Accesorios
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Buscar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contacto</h3>
            <p className="text-muted-foreground text-sm">
              WhatsApp:{' '}
              <a
                href="https://wa.me/573123574867"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Contactar por WhatsApp"
              >
                312 357 4867
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-border/40 mt-8 border-t pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            © <CurrentYear /> ILEGALES. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
