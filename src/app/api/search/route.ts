import { NextRequest, NextResponse } from 'next/server'

import {
  getProducts,
  getCategoriesWithProductCount,
  getBrands,
  getPopularTags,
  type ProductFilters,
  type ProductSortOptions,
} from '@/lib/data'
import { delay } from '@/lib/utils/delay'

/**
 * GET /api/search
 *
 * Búsqueda avanzada de productos con filtros completos.
 * Devuelve también facetas (categorías, marcas, tags) para filtros dinámicos.
 *
 * Query params:
 * - q: string - Término de búsqueda (requerido)
 * - category: string - Filtrar por categoría
 * - subcategory: string - Filtrar por subcategoría
 * - brand: string - Filtrar por marca
 * - minPrice: number - Precio mínimo
 * - maxPrice: number - Precio máximo
 * - tags: string - Tags separados por coma
 * - inStock: boolean - Solo productos con stock
 * - sort: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'name'
 * - page: number - Página actual (default: 1)
 * - limit: number - Items por página (default: 12, max: 50)
 *
 * Cache: 30s con stale-while-revalidate de 60s (búsquedas cambian frecuentemente)
 */
export async function GET(request: NextRequest) {
  // Simular latencia de búsqueda (un poco más que un listado normal)
  await delay(400, 1000)

  const { searchParams } = request.nextUrl

  // Obtener query de búsqueda
  const query = searchParams.get('q') ?? searchParams.get('query') ?? ''

  if (!query.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: 'Se requiere un término de búsqueda (parámetro "q")',
      },
      { status: 400 }
    )
  }

  // Construir filtros
  const filters: ProductFilters = {
    search: query.trim(),
  }

  const category = searchParams.get('category')
  if (category) filters.categoryId = category

  const subcategory = searchParams.get('subcategory')
  if (subcategory) filters.subcategoryId = subcategory

  const brand = searchParams.get('brand')
  if (brand) filters.brand = brand

  const minPrice = searchParams.get('minPrice')
  if (minPrice) filters.minPrice = parseInt(minPrice, 10)

  const maxPrice = searchParams.get('maxPrice')
  if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10)

  const tags = searchParams.get('tags')
  if (tags) filters.tags = tags.split(',').map((t) => t.trim())

  const inStock = searchParams.get('inStock')
  if (inStock === 'true') filters.inStock = true

  // Construir ordenamiento
  let sort: ProductSortOptions | undefined
  const sortParam = searchParams.get('sort')

  switch (sortParam) {
    case 'price-asc':
      sort = { field: 'price', order: 'asc' }
      break
    case 'price-desc':
      sort = { field: 'price', order: 'desc' }
      break
    case 'newest':
      sort = { field: 'createdAt', order: 'desc' }
      break
    case 'name':
      sort = { field: 'name', order: 'asc' }
      break
    case 'relevance':
    default:
      // Por defecto, ordenar por nombre (simulando relevancia)
      sort = { field: 'name', order: 'asc' }
  }

  // Paginación
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10))
  )

  // Obtener resultados
  const results = getProducts(filters, sort, { page, limit })

  // Obtener facetas para filtros dinámicos
  const facets = {
    categories: getCategoriesWithProductCount(),
    brands: getBrands(),
    popularTags: getPopularTags(15),
  }

  return NextResponse.json(
    {
      success: true,
      query: query.trim(),
      ...results,
      facets,
    },
    {
      headers: {
        // Búsquedas cambian frecuentemente, cache corto
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    }
  )
}

// Búsquedas son dinámicas pero con cache corto
export const revalidate = 30
