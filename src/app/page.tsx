// Esta es la pagina de inicio (SSG - Static Site Generation).
// Se genera en build time y se sirve como HTML estatico.
// Ideal para contenido que no cambia frecuentemente.

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold">ILEGALES</h1>
      <p className="text-muted-foreground mb-2 text-xl">Tienda Urbana</p>
      <p className="text-muted-foreground text-center">
        Tattoo • Graffiti • Galería • Artículos y Accesorios • Stickers
      </p>
    </main>
  )
}
