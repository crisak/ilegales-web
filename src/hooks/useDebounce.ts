// 'use client': Hook que usa useState y useEffect,
// necesario para manejar estado en el cliente.
'use client'

import { useState, useEffect } from 'react'

/**
 * Hook para debounce de valores.
 * Util para evitar llamadas excesivas a API en busquedas.
 *
 * @param value - Valor a debounce
 * @param delay - Tiempo de espera en ms (default: 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
