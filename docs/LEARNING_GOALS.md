# Objetivos de Aprendizaje - Next.js 16

> POC para comprender renderizado, SEO y accesibilidad en Next.js

---

## IMPORTANTE: Incompatibilidades con cacheComponents

> **Cuando `cacheComponents: true` esta habilitado en next.config.ts, estas configuraciones de segmento de ruta causan ERROR:**
> - `export const revalidate` - NO USAR
> - `export const dynamic` - NO USAR
> - `export const dynamicParams` - NO USAR
>
> **En su lugar, usar el nuevo modelo:**
> - `'use cache'` directive + `cacheLife()` + `cacheTag()`
> - Todo es dinamico por defecto (sin cache)
> - Para cachear, agregar `'use cache'` al inicio de la funcion/componente

---

## 1. Tipos de Renderizado

### 1.1 Contenido Estatico Cacheado (reemplaza SSG)
- **Que es:** Paginas/componentes cacheados con `'use cache'` + `cacheLife('max')`
- **Implementar en:** Home page
- **Aprender:**
  - `'use cache'` directive al inicio de funcion
  - `cacheLife('max')` para cache de larga duracion
  - Cuando NO cachear (datos personalizados, tiempo real)
- **Configuracion clave:**
  ```tsx
  // src/app/page.tsx (Home)
  import { cacheLife, cacheTag } from 'next/cache'

  // 'use cache' + cacheLife('max'): Equivale al antiguo SSG.
  // La pagina se cachea indefinidamente hasta invalidacion manual.
  export default async function HomePage() {
    'use cache'
    cacheLife('max')
    cacheTag('home')

    return <main>...</main>
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.2 Cache con Revalidacion (reemplaza ISR)
- **Que es:** Paginas cacheadas que se revalidan periodicamente
- **Implementar en:** Lista de productos, Categorias
- **Aprender:**
  - `cacheLife({ revalidate: N })` para tiempo en segundos
  - `cacheLife('hours')`, `cacheLife('days')` para perfiles predefinidos
  - `cacheTag()` para invalidacion on-demand con `revalidateTag()`
- **Configuracion clave:**
  ```tsx
  // src/app/products/page.tsx
  import { cacheLife, cacheTag } from 'next/cache'

  // 'use cache' + cacheLife({ revalidate: 60 }): Equivale al antiguo ISR.
  // La pagina se revalida cada 60 segundos si hay trafico.
  // NO usar export const revalidate = 60 (causa error con cacheComponents).
  export default async function ProductsPage() {
    'use cache'
    cacheLife({ revalidate: 60 }) // O usar cacheLife('hours')
    cacheTag('products')

    const products = await getProducts()
    return <ProductGrid products={products} />
  }
  ```
- **Perfiles de cacheLife:**
  ```tsx
  cacheLife('seconds')  // Muy corto
  cacheLife('minutes')  // Minutos
  cacheLife('hours')    // Horas
  cacheLife('days')     // Dias
  cacheLife('weeks')    // Semanas
  cacheLife('max')      // Maximo (indefinido)
  cacheLife({ revalidate: 60 }) // Custom: 60 segundos
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.3 Renderizado Dinamico (reemplaza SSR/force-dynamic)
- **Que es:** Paginas que se renderizan en cada request (comportamiento por defecto)
- **Implementar en:** Busqueda
- **Aprender:**
  - Con cacheComponents, TODO es dinamico por defecto
  - NO usar `export const dynamic = 'force-dynamic'` (causa error)
  - Simplemente no poner `'use cache'` = dinamico
- **Configuracion clave:**
  ```tsx
  // src/app/search/page.tsx

  // SIN 'use cache' = dinamico automaticamente
  // NO necesitas export const dynamic = 'force-dynamic'
  // Con cacheComponents, todo es dinamico a menos que uses 'use cache'
  export default async function SearchPage({
    searchParams,
  }: {
    searchParams: Promise<{ q?: string }>
  }) {
    const { q } = await searchParams // searchParams es Promise en Next.js 16

    const results = await searchProducts(q)
    return <SearchResults results={results} />
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.4 Client-Side Rendering (CSR)
- **Que es:** Renderizado en el navegador del usuario
- **Implementar en:** SearchBar, Filters, ImageGallery
- **Aprender:**
  - `'use client'` directive (sin cambios en Next.js 16)
  - Cuando es necesario (useState, useEffect, eventos, browser APIs)
  - Impacto en bundle size (mas Client Components = mas JS)
- **Regla:**
  ```tsx
  // 'use client': SOLO usar cuando necesites:
  // - useState, useReducer, useEffect
  // - Event handlers (onClick, onChange, onSubmit)
  // - Browser APIs (localStorage, window, navigator)
  // - Librerias que requieren el navegador
  'use client'

  import { useState } from 'react'

  export function SearchBar() {
    const [query, setQuery] = useState('')
    // ...
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.5 Streaming + Suspense
- **Que es:** Envio progresivo de HTML al cliente
- **Implementar en:** Detalle de producto (precio, stock)
- **Aprender:**
  - `loading.tsx` para loading UI automatico por segmento de ruta
  - `<Suspense>` boundaries manuales para control granular
  - Cargas en paralelo vs secuencial
- **Patron clave:**
  ```tsx
  // Suspense permite mostrar contenido parcial mientras otros
  // componentes siguen cargando. El fallback se muestra inmediatamente.
  <Suspense fallback={<Skeleton />}>
    <SlowComponent />
  </Suspense>

  // Multiples Suspense boundaries cargan EN PARALELO, no secuencial
  <Suspense fallback={<PriceSkeleton />}>
    <LivePrice />
  </Suspense>
  <Suspense fallback={<StockSkeleton />}>
    <StockLevel />  {/* Carga al mismo tiempo que LivePrice */}
  </Suspense>
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.6 generateStaticParams (con cacheComponents)
- **Que es:** Pre-generar rutas dinamicas en build time
- **Implementar en:** Categorias, productos populares
- **Aprender:**
  - `generateStaticParams()` sigue funcionando igual
  - NO usar `export const dynamicParams` (causa error con cacheComponents)
  - Las rutas no listadas se generan on-demand automaticamente
- **Configuracion clave:**
  ```tsx
  // src/app/products/[category]/page.tsx
  import { cacheLife, cacheTag } from 'next/cache'

  // generateStaticParams: Pre-genera rutas en build time.
  // Las rutas no listadas se generan on-demand automaticamente.
  // NO usar dynamicParams con cacheComponents (causa error).
  export async function generateStaticParams() {
    const categories = await getCategories()
    return categories.map(cat => ({ category: cat.slug }))
  }

  export default async function CategoryPage({
    params,
  }: {
    params: Promise<{ category: string }>
  }) {
    'use cache'
    const { category } = await params

    cacheLife('hours')
    cacheTag(`category-${category}`)

    const products = await getProductsByCategory(category)
    return <ProductGrid products={products} />
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.7 PPR con Cache Components (Next.js 16)
- **Que es:** Shell estatico cacheado + holes dinamicos en una pagina
- **Implementar en:** Detalle de producto (info cacheada + precio/stock dinamico)
- **Aprender:**
  - Partes con `'use cache'` = shell estatico (cacheado)
  - Partes sin `'use cache'` dentro de `<Suspense>` = holes dinamicos
  - El shell se sirve instantaneamente, holes se streaman
- **Patron PPR completo:**
  ```tsx
  // src/app/products/[category]/[productId]/page.tsx
  import { Suspense } from 'react'
  import { cacheLife, cacheTag } from 'next/cache'

  export default async function ProductPage({
    params,
  }: {
    params: Promise<{ category: string; productId: string }>
  }) {
    'use cache' // La pagina base es cacheada (shell)

    const { productId } = await params
    cacheLife({ revalidate: 60 })
    cacheTag(`product-${productId}`)

    const product = await getProduct(productId)

    return (
      <main>
        {/* Shell estatico - cacheado */}
        <ProductInfo product={product} />
        <ProductImages images={product.images} />

        {/* Holes dinamicos - sin cache, streaming */}
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
- **Componente dinamico (hole):**
  ```tsx
  // src/components/features/ProductDetail/LivePrice.tsx

  // SIN 'use cache' = este componente es dinamico (hole en PPR)
  // Se renderiza en cada request, no se cachea
  export async function LivePrice({ productId }: { productId: string }) {
    const { price } = await getRealTimePrice(productId)

    return (
      <span aria-live="polite" className="text-2xl font-bold">
        ${price.toLocaleString()}
      </span>
    )
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.8 Cache en Funciones (no solo componentes)
- **Que es:** `'use cache'` tambien funciona en funciones de datos
- **Implementar en:** lib/api/products.ts
- **Aprender:**
  - Cachear logica de fetch independiente del componente
  - Reutilizar cache entre multiples componentes
  - Invalidacion granular con cacheTag
- **Patron:**
  ```tsx
  // src/lib/api/products.ts
  import { cacheLife, cacheTag } from 'next/cache'

  // 'use cache' en funcion: cachea el resultado independiente
  // de donde se llame. Multiples componentes comparten este cache.
  export async function getProducts() {
    'use cache'
    cacheLife('hours')
    cacheTag('products')

    const response = await fetch(`${API_URL}/products`)
    return response.json()
  }

  // Funcion SIN cache para datos en tiempo real
  export async function getRealTimePrice(productId: string) {
    // Sin 'use cache' = siempre fetch fresco
    const response = await fetch(`${API_URL}/products/${productId}/price`, {
      cache: 'no-store',
    })
    return response.json()
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

---

## 2. SEO en Next.js

### 2.1 Metadata API
- **Aprender:**
  - `generateMetadata()` async function
  - Title templates para consistencia
  - Open Graph tags para redes sociales
  - Twitter Cards
  - Canonical URLs
- **Patron:**
  ```tsx
  // generateMetadata: Genera metadata dinamica basada en params.
  // Se ejecuta en el servidor, puede hacer fetch de datos.
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ productId: string }>
  }): Promise<Metadata> {
    const { productId } = await params // params es Promise en Next.js 16
    const product = await getProduct(productId)

    return {
      title: product.name,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image, width: 1200, height: 630 }],
        type: 'product',
      },
    }
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 2.2 JSON-LD (Datos Estructurados)
- **Aprender:**
  - Schema.org/Product para productos
  - Schema.org/BreadcrumbList para navegacion
  - Validacion con Google Rich Results Test
- **Patron:**
  ```tsx
  function ProductJsonLd({ product }: { product: Product }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.sku,
      brand: { '@type': 'Brand', name: product.brand },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'COP',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    )
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 2.3 Sitemap y Robots.txt
- **Aprender:**
  - `app/sitemap.ts` dinamico
  - `app/robots.ts` dinamico
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

---

## 3. Accesibilidad (a11y)

### 3.1 Navegacion por Teclado
- **Implementar:** Skip links, focus visible, tab order logico
- **Patron Skip Link:**
  ```tsx
  function SkipLink() {
    return (
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
      >
        Saltar al contenido principal
      </a>
    )
  }
  ```
- **Estado:** [ ] Pendiente

### 3.2 ARIA
- **Implementar:** Labels, roles, live regions para contenido dinamico
- **Ejemplos:**
  ```tsx
  // aria-label: Describe el proposito cuando no hay texto visible
  <button aria-label="Cerrar menu">
    <XIcon />
  </button>

  // aria-live: Anuncia cambios dinamicos a lectores de pantalla
  <span aria-live="polite">${price}</span>
  ```
- **Estado:** [ ] Pendiente

### 3.3 Semantic HTML
- **Implementar:** main, nav, article, section, header, footer
- **Estado:** [ ] Pendiente

### 3.4 Imagenes
- **Implementar:** Alt text descriptivo
- **Estado:** [ ] Pendiente

---

## 4. APIs de Next.js 16

### 4.1 Cambios en params/searchParams
- **Aprender:** Ahora son Promises, requieren `await`
- **Migracion:**
  ```tsx
  // ANTES (Next.js 15)
  function Page({ params }) {
    const { id } = params
  }

  // AHORA (Next.js 16)
  async function Page({ params }) {
    const { id } = await params // Asincrono!
  }
  ```
- **Estado:** [ ] Pendiente

### 4.2 cookies(), headers(), draftMode()
- **Aprender:** Ahora son async, requieren `await`
- **Estado:** [ ] Pendiente

### 4.3 Configuraciones Incompatibles con cacheComponents
- **IMPORTANTE:** Estas configuraciones causan ERROR con cacheComponents:
  ```tsx
  // NO USAR - Causa error:
  // "Route segment config X is not compatible with nextConfig.cacheComponents"
  export const revalidate = 60
  export const dynamic = 'force-dynamic'
  export const dynamic = 'force-static'
  export const dynamicParams = true
  ```
- **Usar en su lugar:**
  ```tsx
  // Cache con revalidacion (reemplaza revalidate)
  export default async function Page() {
    'use cache'
    cacheLife({ revalidate: 60 })
    // ...
  }

  // Dinamico (reemplaza force-dynamic)
  // Simplemente NO usar 'use cache'
  export default async function Page() {
    // Sin 'use cache' = dinamico por defecto
    // ...
  }

  // Rutas dinamicas (reemplaza dynamicParams)
  // Solo usar generateStaticParams, el resto es on-demand
  export async function generateStaticParams() {
    return [{ id: '1' }, { id: '2' }]
  }
  ```
- **Estado:** [ ] Pendiente

---

## Registro de Aprendizajes

| Fecha | Concepto | Que aprendi | Archivo de referencia |
|-------|----------|-------------|----------------------|
| | | | |

<!--
Ejemplo:
| 2025-01-31 | cacheComponents | revalidate/dynamic/dynamicParams NO compatibles con cacheComponents | ARCHITECTURE.md |
| 2025-01-31 | PPR | 'use cache' = shell, sin cache + Suspense = hole | ProductPage.tsx |
-->
