import { delay } from '@/lib/utils/delay'

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

interface LiveStockResponse {
  stock: number
  status: StockStatus
}

// fetchLiveStock: Simula una API de inventario en tiempo real.
// En produccion, esto seria una llamada a un servicio de inventario.
// Usa delay para simular latencia de red.
export async function fetchLiveStock(
  productId: string,
  baseStock: number
): Promise<LiveStockResponse> {
  // Simular latencia de API (800-1500ms)
  await delay(800, 1500)

  // Generar variacion deterministica basada en productId y timestamp
  const seed = hashCode(productId + Math.floor(Date.now() / 10000))
  const variation = (seed % 20) - 5 // -5 a +14

  const stock = Math.max(0, baseStock + variation)

  // Determinar estado
  let status: StockStatus
  if (stock === 0) {
    status = 'out_of_stock'
  } else if (stock <= 5) {
    status = 'low_stock'
  } else {
    status = 'in_stock'
  }

  return { stock, status }
}

// Hash simple para generar un numero determinista a partir de un string
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}
