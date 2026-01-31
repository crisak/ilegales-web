# Arquitectura del Proyecto

## Objetivo del POC
Explorar y comprender los diferentes tipos de renderizado en Next.js 16(Using App Router) mediante un e-commerce simplificado, con enfasis en SEO y accesibilidad.

---

## Decisiones de Renderizado

| Pagina | Ruta | Tipo de Render | Justificacion |
|--------|------|----------------|---------------|
| Home | `/` | SSG | Contenido estatico, maximo SEO |
| Lista productos | `/products` | ISR (revalidate: 60) | Catalogo semi-estatico, actualiza periodicamente |
| Categoria | `/products/[category]` | ISR (revalidate: 60) | Igual que lista, filtrado por categoria |
| Detalle producto | `/products/[category]/[productId]` | ISR + Streaming + PPR | Shell estatico + datos dinamicos (precio, stock) |
| Busqueda | `/search` | SSR (force-dynamic) | Depende de searchParams, no cacheable |

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── page.tsx                      # Home (SSG)
│   ├── layout.tsx                    # Root layout
│   ├── not-found.tsx                 # 404 page
│   ├── error.tsx                     # Error boundary
│   │
│   ├── products/
│   │   ├── page.tsx                  # Lista productos (ISR)
│   │   ├── loading.tsx               # Skeleton lista
│   │   │
│   │   └── [category]/
│   │       ├── page.tsx              # Categoria (ISR)
│   │       ├── loading.tsx
│   │       │
│   │       └── [productId]/
│   │           ├── page.tsx          # Detalle (ISR + Streaming + PPR)
│   │           ├── loading.tsx
│   │           └── error.tsx
│   │
│   ├── search/
│   │   ├── page.tsx                  # Busqueda (SSR dynamic)
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
│       │   ├── ProductInfo.tsx       # Server Component (estatico, con 'use cache')
│       │   ├── ProductImages.tsx     # Server Component
│       │   ├── LivePrice.tsx         # Server Component (dinamico, streaming)
│       │   ├── StockLevel.tsx        # Server Component (dinamico, streaming)
│       │   └── ImageGallery.tsx      # Client Component (interactivo)
│       │
│       └── Search/
│           ├── SearchBar.tsx         # Client Component
│           ├── SearchResults.tsx     # Server Component
│           └── Filters.tsx           # Client Component
│
├── lib/
│   ├── api/
│   │   ├── products.ts               # Funciones fetch productos
│   │   ├── categories.ts             # Funciones fetch categorias
│   │   └── search.ts                 # Funciones fetch busqueda
│   │
│   ├── data/
│   │   ├── products.json             # Mock data productos
│   │   └── categories.json           # Mock data categorias
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

## Patrones de Codigo

### 1. Server Component con Data Fetching (ISR)
```tsx
// src/app/products/page.tsx

// revalidate = 60: La pagina se regenera cada 60 segundos si hay trafico.
// Esto implementa ISR (Incremental Static Regeneration).
// El usuario siempre recibe respuesta rapida (cached), mientras Next.js
// regenera en background si el cache expiro.
export const revalidate = 60

async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### 2. Streaming con Suspense
```tsx
// src/app/products/[category]/[productId]/page.tsx
import { Suspense } from 'react'

async function ProductPage({ params }) {
  // params es Promise en Next.js 16, debe usar await
  const { productId } = await params
  const product = await getProduct(productId)

  return (
    <main>
      {/* Contenido estatico - se renderiza inmediatamente */}
      <ProductInfo product={product} />

      {/* Contenido dinamico - streaming */}
      <Suspense fallback={<PriceSkeleton />}>
        <LivePrice productId={productId} />
      </Suspense>

      <Suspense fallback={<StockSkeleton />}>
        <StockLevel productId={productId} />
      </Suspense>
    </main>
  )
}
```

### 3. Cache Components + PPR (Next.js 16)
```tsx
// src/components/features/ProductDetail/ProductInfo.tsx

// 'use cache': Marca este componente como cacheable.
// Forma parte del "shell estatico" en PPR (Partial Prerendering).
// El HTML de este componente se genera en build/ISR y se sirve instantaneamente.
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function ProductInfo({ productId }: Props) {
  // cacheLife('hours'): Define cuanto tiempo el contenido se considera fresco.
  // Perfiles disponibles: 'max', 'hours', 'days', 'weeks'
  cacheLife('hours')

  // cacheTag: Permite invalidar este cache con revalidateTag('product-123')
  cacheTag(`product-${productId}`)

  const product = await getProduct(productId)
  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </article>
  )
}
```

```tsx
// src/components/features/ProductDetail/LivePrice.tsx

// Este componente NO usa 'use cache', por lo que es dinamico.
// Se renderiza como "hole" en PPR - streaming en cada request.
// Ideal para datos que cambian frecuentemente (precio, stock).
export async function LivePrice({ productId }: Props) {
  const price = await fetchRealTimePrice(productId)
  return (
    <span aria-live="polite" className="text-2xl font-bold">
      ${price}
    </span>
  )
}
```

### 4. Client Component para Interactividad
```tsx
// src/components/features/Search/SearchBar.tsx

// 'use client': Este componente necesita useState y event handlers,
// por lo que debe ejecutarse en el cliente.
// Regla: usar Client Component SOLO cuando necesites interactividad.
'use client'

import { useState } from 'react'

export function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <form role="search" aria-label="Buscar productos">
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

### 5. API Route con Delay Simulado
```tsx
// src/app/api/products/route.ts
import { delay } from '@/lib/utils/delay'
import products from '@/lib/data/products.json'

export async function GET() {
  // Simular latencia de API real (300-800ms)
  // Esto permite probar loading states y Suspense boundaries
  await delay(300, 800)

  return Response.json(products)
}
```

---

## Decisiones Tecnicas

### Fuente de Datos
- **Mock data:** JSON files en `lib/data/`
- **API Routes:** `app/api/` con delays simulados (300-800ms)
- **Razon:** Simular comportamiento real sin dependencias externas

### Next.js Config
```ts
// next.config.ts
const nextConfig = {
  // cacheComponents: true - Habilita Cache Components y PPR
  // Reemplaza el antiguo experimental.ppr de Next.js 15
  cacheComponents: true,
}
```

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

## Notas de Arquitectura

### Por que ISR en lugar de SSG puro para productos?
ISR permite actualizar el catalogo sin rebuild completo. En produccion real,
los productos cambian frecuentemente (precio, stock, disponibilidad).

### Por que SSR para busqueda?
Los searchParams cambian con cada busqueda. No tiene sentido cachear
resultados de busqueda porque las combinaciones son infinitas.

### Por que Streaming + PPR en detalle de producto?
Permite mostrar el shell estatico (nombre, descripcion, imagenes) instantaneamente
mientras datos dinamicos (precio real, stock) se cargan en paralelo como "holes".
Mejor experiencia de usuario y mejor SEO (el contenido principal esta en el HTML inicial).

### Como funciona PPR con Cache Components?
1. Componentes con `'use cache'` forman el shell estatico (pre-renderizado)
2. Componentes sin `'use cache'` que acceden a datos dinamicos son "holes"
3. El shell se sirve instantaneamente, los holes se streaman despues
4. Todo en una sola respuesta HTTP (no requiere JavaScript para el contenido inicial)
