'use client'

import { useState, useEffect } from 'react'

// CurrentYear: Client Component que muestra el año actual.
// 'use client' es necesario porque new Date() no es compatible
// con cacheComponents en Server Components.
// Usamos useEffect para evitar errores de prerendering.
// El año se establece solo despues del mount en el cliente.
export function CurrentYear() {
  // Valor inicial estatico para SSR/prerender
  const [year, setYear] = useState(2025)

  useEffect(() => {
    // Se ejecuta solo en el cliente despues del mount
    setYear(new Date().getFullYear())
  }, [])

  return <>{year}</>
}
