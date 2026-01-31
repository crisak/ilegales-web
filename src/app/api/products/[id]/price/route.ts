import { NextRequest, NextResponse } from 'next/server'

import { getProductById } from '@/lib/data'
import { delay } from '@/lib/utils/delay'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/products/[id]/price
 *
 * Precio en tiempo real de un producto.
 * Delay más largo (800-1500ms) para demostrar streaming/PPR.
 *
 * Simula un precio que podría variar (ej: por inventario, promociones, etc.)
 *
 * Este endpoint es dinámico por defecto debido a Math.random() y new Date().
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Delay más largo para demostrar streaming
  await delay(800, 1500)

  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        error: 'Producto no encontrado',
      },
      { status: 404 }
    )
  }

  // Simular pequeña variación de precio (±5%) para demostrar datos dinámicos
  const variation = 1 + (Math.random() * 0.1 - 0.05)
  const currentPrice = Math.round(product.price * variation)

  return NextResponse.json(
    {
      success: true,
      data: {
        productId: product.id,
        price: currentPrice,
        compareAtPrice: product.compareAtPrice,
        currency: 'COP',
        hasDiscount: product.compareAtPrice
          ? currentPrice < product.compareAtPrice
          : false,
        discountPercentage: product.compareAtPrice
          ? Math.round((1 - currentPrice / product.compareAtPrice) * 100)
          : 0,
        timestamp: new Date().toISOString(),
      },
    },
    {
      headers: {
        // Sin cache - datos en tiempo real
        'Cache-Control': 'no-store, must-revalidate',
      },
    }
  )
}
