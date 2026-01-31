import { NextRequest, NextResponse } from 'next/server'

import { getProductById } from '@/lib/data'
import { delay } from '@/lib/utils/delay'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/products/[id]/stock
 *
 * Stock en tiempo real de un producto.
 * Delay más largo (800-1500ms) para demostrar streaming/PPR.
 *
 * Simula stock que podría variar en tiempo real.
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

  // Simular pequeña variación de stock para demostrar datos dinámicos
  const variation = Math.floor(Math.random() * 5) - 2 // -2 a +2
  const currentStock = Math.max(0, product.stock + variation)

  // Determinar estado del stock
  let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
  if (currentStock === 0) {
    stockStatus = 'out_of_stock'
  } else if (currentStock <= 5) {
    stockStatus = 'low_stock'
  } else {
    stockStatus = 'in_stock'
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        productId: product.id,
        stock: currentStock,
        stockStatus,
        isAvailable: currentStock > 0,
        lowStockThreshold: 5,
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
