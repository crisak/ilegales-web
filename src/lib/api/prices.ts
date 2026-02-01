import { delay } from '@/lib/utils/delay'

interface LivePriceResponse {
  price: number
  variation: number
}

// fetchLivePrice: Simula una API de precios en tiempo real.
// En produccion, esto seria una llamada a un servicio de precios.
// Usa delay para simular latencia de red.
export async function fetchLivePrice(
  productId: string,
  basePrice: number
): Promise<LivePriceResponse> {
  // Simular latencia de API (800-1500ms)
  await delay(800, 1500)

  // Generar variacion deterministica basada en productId y timestamp
  // Esto evita el error de impureza en React mientras mantiene
  // la variacion "aleatoria" para propositos de demo
  const seed = hashCode(productId + Math.floor(Date.now() / 10000))
  const variation = ((seed % 100) - 50) / 1000 // -5% a +5%

  const price = Math.round(basePrice * (1 + variation))

  return { price, variation }
}

// Hash simple para generar un numero determinista a partir de un string
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}
