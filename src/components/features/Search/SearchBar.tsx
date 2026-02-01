'use client'

// 'use client': Este componente necesita useState y event handlers,
// por lo que debe ejecutarse en el cliente.
// Regla: usar Client Component SOLO cuando necesites interactividad.

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
}

// SearchBar: Barra de busqueda interactiva.
// Client Component porque usa estado y event handlers.
// Usa debounce para evitar busquedas excesivas mientras el usuario escribe.
export function SearchBar({
  initialQuery = '',
  placeholder = 'Buscar productos...',
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(initialQuery)

  // Debounce la navegacion para evitar muchas requests
  const { fn: debouncedSearch, cancel } = useDebounce((searchQuery: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim())
      } else {
        params.delete('q')
      }

      // Resetear pagina al buscar
      params.delete('page')

      router.push(`/search?${params.toString()}`)
    })
  }, 300)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      cancel()

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (query.trim()) {
          params.set('q', query.trim())
        } else {
          params.delete('q')
        }

        params.delete('page')
        router.push(`/search?${params.toString()}`)
      })
    },
    [query, router, searchParams, cancel]
  )

  return (
    <form
      role="search"
      aria-label="Buscar productos"
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <div className="relative">
        {/* Icono de busqueda */}
        <span
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden="true"
        >
          🔍
        </span>

        {/* Input */}
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label="Buscar productos"
          className="bg-input border-border placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-3 pr-4 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none"
        />

        {/* Indicador de carga */}
        {isPending && (
          <span
            className="absolute top-1/2 right-3 -translate-y-1/2"
            aria-hidden="true"
          >
            <span className="border-primary inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          </span>
        )}
      </div>

      {/* Boton submit (visualmente oculto, pero accesible) */}
      <button type="submit" className="sr-only">
        Buscar
      </button>
    </form>
  )
}
