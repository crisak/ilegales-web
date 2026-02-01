// 'use client': Hook que usa useState y useEffect,
// necesario para manejar estado en el cliente.
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook para debounce de valores.
 * Util para evitar llamadas excesivas a API en busquedas.
 *
 * @param value - Valor a debounce
 * @param delay - Tiempo de espera en ms (default: 300)
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
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

/**
 * Hook para crear una funcion debounced.
 * Ideal para busquedas que actualizan la URL.
 * Retorna un objeto con la funcion debounced y un metodo cancel.
 *
 * @param callback - Funcion a ejecutar despues del delay
 * @param delay - Tiempo de espera en ms (default: 300)
 */
export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay = 300
): { fn: (...args: Parameters<T>) => void; cancel: () => void } {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(callback)

  // Mantener referencia actualizada del callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const fn = useCallback(
    (...args: Parameters<T>) => {
      cancel()
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [cancel, delay]
  )

  // Limpiar al desmontar
  useEffect(() => {
    return cancel
  }, [cancel])

  return { fn, cancel }
}
