import { NextRequest, NextResponse } from 'next/server'

import { getProductWithCategory } from '@/lib/data'
import { delay } from '@/lib/utils/delay'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/products/[id]
 *
 * Detalle completo de un producto incluyendo categoría y subcategoría.
 *
 * Cache: 60s con stale-while-revalidate de 300s
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Simular latencia de API real (300-800ms)
  await delay()

  const { id } = await params
  const product = getProductWithCategory(id)

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        error: 'Producto no encontrado',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      data: product,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
