import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { CACHE_TAGS } from '@/lib/constants/cache-tags'

/**
 * Helper para revalidar tags con el profile 'max' de Next.js 16
 * En Next.js 16, revalidateTag requiere un segundo argumento (profile)
 * 'max' proporciona stale-while-revalidate: sirve contenido stale mientras
 * obtiene datos frescos en background
 */
function revalidate(tag: string): void {
  revalidateTag(tag, 'max')
}

/**
 * POST /api/revalidate
 *
 * Webhook para on-demand revalidation.
 * Permite invalidar cache de forma granular usando tags.
 *
 * Body (JSON):
 * - secret: string - Token secreto para autorización
 * - tag: string - Tag específico a invalidar
 * - type: 'product' | 'category' | 'all' - Tipo de contenido
 * - id?: string - ID específico (para product o category)
 *
 * Ejemplos:
 * - Revalidar todos los productos: { type: 'products' }
 * - Revalidar un producto: { type: 'product', id: 'montana-94-negro' }
 * - Revalidar precio de producto: { type: 'product-price', id: 'montana-94-negro' }
 * - Revalidar todas las categorías: { type: 'categories' }
 * - Revalidar todo: { type: 'all' }
 * - Tag personalizado: { tag: 'my-custom-tag' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar token secreto (en producción usar variable de entorno)
    const secret = body.secret as string | undefined
    const expectedSecret =
      process.env.REVALIDATE_SECRET ?? 'dev-secret-change-in-production'

    if (secret !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token de autorización inválido',
        },
        { status: 401 }
      )
    }

    const revalidatedTags: string[] = []

    // Revalidar por tag específico
    if (body.tag) {
      revalidate(body.tag)
      revalidatedTags.push(body.tag)
    }

    // Revalidar por tipo
    const type = body.type as string | undefined
    const id = body.id as string | undefined

    switch (type) {
      case 'products':
        revalidate(CACHE_TAGS.PRODUCTS)
        revalidatedTags.push(CACHE_TAGS.PRODUCTS)
        break

      case 'product':
        if (!id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Se requiere "id" para revalidar un producto específico',
            },
            { status: 400 }
          )
        }
        revalidate(CACHE_TAGS.PRODUCT(id))
        revalidatedTags.push(CACHE_TAGS.PRODUCT(id))
        break

      case 'product-price':
        if (!id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Se requiere "id" para revalidar precio de producto',
            },
            { status: 400 }
          )
        }
        revalidate(CACHE_TAGS.PRODUCT_PRICE(id))
        revalidatedTags.push(CACHE_TAGS.PRODUCT_PRICE(id))
        break

      case 'product-stock':
        if (!id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Se requiere "id" para revalidar stock de producto',
            },
            { status: 400 }
          )
        }
        revalidate(CACHE_TAGS.PRODUCT_STOCK(id))
        revalidatedTags.push(CACHE_TAGS.PRODUCT_STOCK(id))
        break

      case 'categories':
        revalidate(CACHE_TAGS.CATEGORIES)
        revalidatedTags.push(CACHE_TAGS.CATEGORIES)
        break

      case 'category':
        if (!id) {
          return NextResponse.json(
            {
              success: false,
              error: 'Se requiere "id" (slug) para revalidar una categoría',
            },
            { status: 400 }
          )
        }
        revalidate(CACHE_TAGS.CATEGORY(id))
        revalidatedTags.push(CACHE_TAGS.CATEGORY(id))
        break

      case 'search':
        revalidate(CACHE_TAGS.SEARCH)
        revalidatedTags.push(CACHE_TAGS.SEARCH)
        break

      case 'all':
        // Revalidar todos los tags principales
        revalidate(CACHE_TAGS.PRODUCTS)
        revalidate(CACHE_TAGS.CATEGORIES)
        revalidate(CACHE_TAGS.SEARCH)
        revalidatedTags.push(
          CACHE_TAGS.PRODUCTS,
          CACHE_TAGS.CATEGORIES,
          CACHE_TAGS.SEARCH
        )
        break
    }

    if (revalidatedTags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No se especificó ningún tag o tipo para revalidar',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      revalidated: revalidatedTags,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error en revalidación:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar la solicitud de revalidación',
      },
      { status: 500 }
    )
  }
}

// Este endpoint siempre es dinámico
export const dynamic = 'force-dynamic'
