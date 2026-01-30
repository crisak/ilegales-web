/**
 * Simula latencia de API para propositos educativos.
 * Permite probar loading states y Suspense boundaries.
 *
 * @param min - Tiempo minimo en ms (default: 300)
 * @param max - Tiempo maximo en ms (default: 800)
 */
export function delay(min = 300, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}
