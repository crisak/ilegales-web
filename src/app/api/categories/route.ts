import { NextRequest, NextResponse } from 'next/server'

import { getCategoriesWithProductCount, getCategoryBySlug } from '@/lib/data'
import { delay } from '@/lib/utils/delay'

/**
 * GET /api/categories
 *
 * Lista de categorías con conteo de productos.
 *
 * Query params:
 * - slug: string - Obtener una categoría específica por slug
 * - withProducts: boolean - Incluir conteo de productos (default: true)
 *
 * Cache: 300s con stale-while-revalidate de 600s (las categorías cambian menos)
 */
export async function GET(request: NextRequest) {
  // Simular latencia de API real (300-800ms)
  await delay()

  const { searchParams } = request.nextUrl

  // Si se pide una categoría específica
  const slug = searchParams.get('slug')
  if (slug) {
    const category = getCategoryBySlug(slug)

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Categoría no encontrada',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  }

  // Lista completa de categorías
  const categories = getCategoriesWithProductCount()

  return NextResponse.json(
    {
      success: true,
      data: categories,
      total: categories.length,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  )
}
