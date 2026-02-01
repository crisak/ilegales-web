// SkipLink: Enlace de accesibilidad para saltar al contenido principal.
// Permite a usuarios de teclado/lectores de pantalla saltar la navegacion.
// El enlace es invisible hasta que recibe foco (se muestra con :focus).
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-primary text-primary-foreground fixed top-4 left-4 z-[100] -translate-y-full rounded-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0 focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      Saltar al contenido principal
    </a>
  )
}
