import { NextRequest, NextResponse } from 'next/server'

import {
  getProducts,
  type ProductFilters,
  type ProductSortOptions,
} from '@/lib/data'
import { delay } from '@/lib/utils/delay'

/**
 * GET /api/products
 *
 * Lista de productos con filtros, ordenamiento y paginación.
 *
 * Query params:
 * - category: string - Filtrar por categoría
 * - subcategory: string - Filtrar por subcategoría
 * - featured: boolean - Solo productos destacados
 * - new: boolean - Solo productos nuevos
 * - minPrice: number - Precio mínimo
 * - maxPrice: number - Precio máximo
 * - search: string - Búsqueda en nombre/descripción/tags
 * - brand: string - Filtrar por marca
 * - inStock: boolean - Solo productos con stock
 * - sort: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'stock'
 * - page: number - Página actual (default: 1)
 * - limit: number - Items por página (default: 12, max: 50)
 *
 * Cache: 60s con stale-while-revalidate de 300s
 */
export async function GET(request: NextRequest) {
  // Simular latencia de API real (300-800ms)
  await delay()

  const { searchParams } = request.nextUrl

  // Construir filtros
  const filters: ProductFilters = {}

  const category = searchParams.get('category')
  if (category) filters.categoryId = category

  const subcategory = searchParams.get('subcategory')
  if (subcategory) filters.subcategoryId = subcategory

  const featured = searchParams.get('featured')
  if (featured === 'true') filters.featured = true

  const isNew = searchParams.get('new')
  if (isNew === 'true') filters.isNew = true

  const minPrice = searchParams.get('minPrice')
  if (minPrice) filters.minPrice = parseInt(minPrice, 10)

  const maxPrice = searchParams.get('maxPrice')
  if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10)

  const search = searchParams.get('search')
  if (search) filters.search = search

  const brand = searchParams.get('brand')
  if (brand) filters.brand = brand

  const inStock = searchParams.get('inStock')
  if (inStock === 'true') filters.inStock = true

  // Construir ordenamiento
  let sort: ProductSortOptions | undefined
  const sortParam = searchParams.get('sort')

  if (sortParam) {
    switch (sortParam) {
      case 'price-asc':
        sort = { field: 'price', order: 'asc' }
        break
      case 'price-desc':
        sort = { field: 'price', order: 'desc' }
        break
      case 'name-asc':
        sort = { field: 'name', order: 'asc' }
        break
      case 'name-desc':
        sort = { field: 'name', order: 'desc' }
        break
      case 'newest':
        sort = { field: 'createdAt', order: 'desc' }
        break
      case 'stock':
        sort = { field: 'stock', order: 'desc' }
        break
    }
  }

  // Paginación
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10))
  )

  // Obtener productos
  const result = getProducts(filters, sort, { page, limit })

  return NextResponse.json(
    {
      success: true,
      ...result,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
