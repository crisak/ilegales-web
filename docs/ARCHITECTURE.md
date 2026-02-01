# Arquitectura del Proyecto

## Objetivo del POC
Explorar y comprender los diferentes tipos de renderizado en Next.js 16 (Using App Router) mediante un e-commerce simplificado, con enfasis en SEO y accesibilidad.

---

## IMPORTANTE: cacheComponents en Next.js 16

> **Cuando `cacheComponents: true` esta habilitado, las siguientes configuraciones de segmento de ruta NO son compatibles y deben eliminarse:**
> - `export const revalidate = N` -> Usar `'use cache'` + `cacheLife()`
> - `export const dynamic = 'force-dynamic'` -> Ya no es necesario (todo es dinamico por defecto)
> - `export const dynamic = 'force-static'` -> Usar `'use cache'` + `cacheLife('max')`
> - `export const dynamicParams = true/false` -> Usar `generateStaticParams()` solamente
>
> **El nuevo modelo con `cacheComponents`:**
> - Todas las paginas son dinamicas por defecto
> - Para cachear, usar `'use cache'` directive + `cacheLife()` + `cacheTag()`
> - El cache se define a nivel de funcion/componente, NO a nivel de ruta

---

## Decisiones de Renderizado (con cacheComponents)

| Pagina | Ruta | Estrategia | Como implementar |
|--------|------|------------|------------------|
| Home | `/` | Estatico cacheado | `'use cache'` + `cacheLife('max')` en page |
| Lista productos | `/products` | Cache con revalidacion | `'use cache'` + `cacheLife('hours')` + `cacheTag('products')` |
| Categoria | `/products/[category]` | Cache con revalidacion | `'use cache'` + `cacheLife('hours')` + `cacheTag('category-{slug}')` |
| Detalle producto | `/products/[category]/[productId]` | PPR (shell + holes) | Shell con `'use cache'`, holes sin cache + Suspense |
| Busqueda | `/search` | Dinamico | Sin `'use cache'` (por defecto todo es dinamico) |

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── page.tsx                      # Home (cacheado)
│   ├── layout.tsx                    # Root layout
│   ├── not-found.tsx                 # 404 page
│   ├── error.tsx                     # Error boundary
│   │
│   ├── products/
│   │   ├── page.tsx                  # Lista productos (cacheado)
│   │   ├── loading.tsx               # Skeleton lista
│   │   │
│   │   └── [category]/
│   │       ├── page.tsx              # Categoria (cacheado)
│   │       ├── loading.tsx
│   │       │
│   │       └── [productId]/
│   │           ├── page.tsx          # Detalle (PPR: shell + holes)
│   │           ├── loading.tsx
│   │           └── error.tsx
│   │
│   ├── search/
│   │   ├── page.tsx                  # Busqueda (dinamico, sin cache)
│   │   └── loading.tsx
│   │
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts              # GET /api/products
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET /api/products/[id]
│   │   │       ├── price/route.ts    # GET precio en tiempo real
│   │   │       └── stock/route.ts    # GET stock en tiempo real
│   │   ├── categories/route.ts       # GET /api/categories
│   │   ├── search/route.ts           # GET /api/search
│   │   └── revalidate/route.ts       # POST webhook revalidacion
│   │
│   ├── sitemap.ts                    # Sitemap dinamico
│   └── robots.ts                     # Robots.txt dinamico
│
├── components/
│   ├── ui/                           # Componentes UI puros
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   │
│   ├── shared/                       # Componentes compartidos
│   │   ├── Header.tsx                # Server Component
│   │   ├── Footer.tsx                # Server Component
│   │   ├── Breadcrumbs.tsx           # Server Component
│   │   └── SkipLink.tsx              # Accesibilidad
│   │
│   └── features/                     # Componentes con logica de negocio
│       ├── ProductCard.tsx           # Server Component
│       ├── ProductGrid.tsx           # Server Component
│       ├── ProductDetail/
│       │   ├── ProductInfo.tsx       # Server Component (con 'use cache')
│       │   ├── ProductImages.tsx     # Server Component (con 'use cache')
│       │   ├── LivePrice.tsx         # Server Component (dinamico, sin cache)
│       │   ├── StockLevel.tsx        # Server Component (dinamico, sin cache)
│       │   └── ImageGallery.tsx      # Client Component (interactivo)
│       │
│       └── Search/
│           ├── SearchBar.tsx         # Client Component
│           ├── SearchResults.tsx     # Server Component
│           └── Filters.tsx           # Client Component
│
├── lib/
│   ├── api/
│   │   ├── products.ts               # Funciones fetch productos (con 'use cache')
│   │   ├── categories.ts             # Funciones fetch categorias (con 'use cache')
│   │   └── search.ts                 # Funciones fetch busqueda (sin cache)
│   │
│   ├── data/
│   │   ├── products.ts               # Mock data productos
│   │   └── categories.ts             # Mock data categorias
│   │
│   ├── utils/
│   │   ├── delay.ts                  # Simular latencia API
│   │   ├── format.ts                 # Formatters (precio, fecha)
│   │   └── seo.ts                    # Helpers SEO (JSON-LD)
│   │
│   └── constants/
│       └── cache-tags.ts             # Tags para revalidacion
│
├── hooks/
│   └── useDebounce.ts                # Para busqueda
│
├── types/
│   ├── product.ts
│   ├── category.ts
│   └── api.ts
│
└── styles/
    └── globals.css                   # Tailwind + custom
```

---

## Patrones de Codigo con cacheComponents

### 1. Pagina Cacheada (reemplaza ISR)
```tsx
// src/app/products/page.tsx
import { cacheLife, cacheTag } from 'next/cache'
import { getProducts } from '@/lib/api/products'
import { ProductGrid } from '@/components/features/ProductGrid'

// 'use cache': Marca toda esta pagina como cacheable.
// Con cacheComponents habilitado, NO usar export const revalidate.
// El cache se define con cacheLife() en lugar de revalidate.
export default async function ProductsPage() {
  'use cache'

  // cacheLife('hours'): El contenido se considera fresco por horas.
  // Perfiles disponibles: 'seconds', 'minutes', 'hours', 'days', 'weeks', 'max'
  // Tambien puedes usar objeto: cacheLife({ revalidate: 60 }) para 60 segundos
  cacheLife('hours')

  // cacheTag: Permite invalidar esta pagina con revalidateTag('products')
  cacheTag('products')

  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### 2. Pagina Dinamica (reemplaza force-dynamic)
```tsx
// src/app/search/page.tsx
import { SearchResults } from '@/components/features/Search/SearchResults'
import { Filters } from '@/components/features/Search/Filters'

// SIN 'use cache' = pagina dinamica por defecto
// Con cacheComponents, NO necesitas export const dynamic = 'force-dynamic'
// Todo es dinamico a menos que uses 'use cache'
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  // searchParams es Promise en Next.js 16
  const { q, category } = await searchParams

  return (
    <main>
      <Filters />
      <SearchResults query={q} category={category} />
    </main>
  )
}
```

### 3. PPR: Shell Estatico + Holes Dinamicos
```tsx
// src/app/products/[category]/[productId]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { getProduct } from '@/lib/api/products'
import { ProductInfo } from '@/components/features/ProductDetail/ProductInfo'
import { LivePrice } from '@/components/features/ProductDetail/LivePrice'
import { StockLevel } from '@/components/features/ProductDetail/StockLevel'
import { PriceSkeleton, StockSkeleton } from '@/components/ui/Skeleton'

// La pagina tiene 'use cache' para el shell estatico.
// Los componentes dentro de Suspense que NO tienen 'use cache' son "holes" dinamicos.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>
}) {
  'use cache'

  const { productId } = await params

  // cacheLife con objeto para control granular (equivale a revalidate: 60)
  cacheLife({ revalidate: 60 })
  cacheTag(`product-${productId}`)

  const product = await getProduct(productId)

  if (!product) {
    return notFound()
  }

  return (
    <main>
      {/* Shell estatico - cacheado con la pagina */}
      <ProductInfo product={product} />

      {/* Holes dinamicos - se streaman en cada request */}
      {/* Estos componentes NO usan 'use cache', por eso son dinamicos */}
      <Suspense fallback={<PriceSkeleton />}>
        <LivePrice productId={productId} />
      </Suspense>

      <Suspense fallback={<StockSkeleton />}>
        <StockLevel productId={productId} />
      </Suspense>
    </main>
  )
}

// generateStaticParams sigue funcionando igual
// NO usar dynamicParams con cacheComponents
export async function generateStaticParams() {
  const products = await getTopProducts(100)
  return products.map((p) => ({
    category: p.category.slug,
    productId: p.id,
  }))
}
```

### 4. Componente Dinamico (Hole en PPR)
```tsx
// src/components/features/ProductDetail/LivePrice.tsx

// SIN 'use cache' = este componente es dinamico
// Se renderiza como "hole" en PPR - streaming en cada request.
// Ideal para datos que cambian frecuentemente (precio, stock).
export async function LivePrice({ productId }: { productId: string }) {
  // Fetch sin cache - siempre obtiene datos frescos
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/price`,
    { cache: 'no-store' }
  )
  const { price } = await response.json()

  return (
    <span aria-live="polite" className="text-2xl font-bold">
      ${price.toLocaleString()}
    </span>
  )
}
```

### 5. Funcion de Datos Cacheada
```tsx
// src/lib/api/products.ts
import { cacheLife, cacheTag } from 'next/cache'

// 'use cache' puede usarse en funciones, no solo componentes
// Esto cachea el resultado de getProducts() independiente de donde se llame
export async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const response = await fetch(`${process.env.API_URL}/api/products`)
  return response.json()
}

// Funcion para obtener producto individual con cache
export async function getProduct(id: string) {
  'use cache'
  cacheLife({ revalidate: 60 }) // Equivale al antiguo revalidate: 60
  cacheTag(`product-${id}`)

  const response = await fetch(`${process.env.API_URL}/api/products/${id}`)
  return response.json()
}

// Funcion SIN cache para datos en tiempo real
export async function getRealTimePrice(productId: string) {
  // Sin 'use cache' = siempre fetch fresco
  const response = await fetch(
    `${process.env.API_URL}/api/products/${productId}/price`,
    { cache: 'no-store' }
  )
  return response.json()
}
```

### 6. Client Component para Interactividad
```tsx
// src/components/features/Search/SearchBar.tsx

// 'use client': Este componente necesita useState y event handlers,
// por lo que debe ejecutarse en el cliente.
// Regla: usar Client Component SOLO cuando necesites interactividad.
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form role="search" aria-label="Buscar productos" onSubmit={handleSubmit}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
      />
    </form>
  )
}
```

---

## Decisiones Tecnicas

### Next.js Config
```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents: true - Habilita el nuevo modelo de cache
  // IMPORTANTE: Con esto habilitado, NO usar:
  // - export const revalidate
  // - export const dynamic
  // - export const dynamicParams
  // En su lugar, usar 'use cache' + cacheLife() + cacheTag()
  cacheComponents: true,
}

export default nextConfig
```

### Fuente de Datos
- **Mock data:** Archivos TS en `lib/data/`
- **API Routes:** `app/api/` con delays simulados (300-800ms)
- **Razon:** Simular comportamiento real sin dependencias externas

### Estilos
- **Tailwind CSS:** Utility-first, facil de mantener
- **CSS custom:** Solo para animaciones o casos especiales
- **Shadcn:** Para usar componentes comunes

### SEO
- `generateMetadata()` en cada pagina
- JSON-LD para productos (Schema.org/Product)
- Sitemap dinamico
- Robots.txt configurado

### Accesibilidad
- Skip links para navegacion por teclado
- ARIA labels en componentes interactivos
- Alt text en todas las imagenes
- Focus states visibles
- Semantic HTML (main, nav, article, etc.)

---

## Migracion de Configuraciones Antiguas

### Antes (Next.js 15 o sin cacheComponents)
```tsx
// NO USAR con cacheComponents: true
export const revalidate = 60
export const dynamic = 'force-dynamic'
export const dynamicParams = true
```

### Ahora (Next.js 16 con cacheComponents)
```tsx
// Pagina cacheada (reemplaza revalidate)
export default async function Page() {
  'use cache'
  cacheLife({ revalidate: 60 })
  cacheTag('my-tag')
  // ...
}

// Pagina dinamica (reemplaza force-dynamic)
// Simplemente NO usar 'use cache'
export default async function Page() {
  // Sin 'use cache' = dinamico por defecto
  // ...
}

// Rutas dinamicas (reemplaza dynamicParams)
// Solo usar generateStaticParams, el resto se genera on-demand
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
// Las rutas no listadas se generan dinamicamente (comportamiento por defecto)
```

---

## Notas de Arquitectura

### Por que usar cacheComponents?
El nuevo modelo de cache es mas explicito y granular:
- Cache a nivel de funcion/componente, no de ruta completa
- Mejor composicion: puedes tener partes cacheadas y partes dinamicas
- PPR automatico cuando mezclas 'use cache' con componentes sin cache
- Invalidacion mas precisa con cacheTag()

### Como funciona PPR con cacheComponents?
1. Componentes/funciones con `'use cache'` forman el shell estatico
2. Componentes sin `'use cache'` dentro de `<Suspense>` son "holes" dinamicos
3. El shell se sirve instantaneamente desde cache
4. Los holes se streaman cuando estan listos
5. Todo en una sola respuesta HTTP

### Cuando NO usar 'use cache'?
- Paginas que dependen de cookies/headers (autenticacion)
- Busqueda con searchParams que cambian constantemente
- Datos en tiempo real (precios, stock, notificaciones)
- Contenido personalizado por usuario
