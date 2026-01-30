# Objetivos de Aprendizaje - Next.js 16

> POC para comprender renderizado, SEO y accesibilidad en Next.js

---

## 1. Tipos de Renderizado

### 1.1 Static Site Generation (SSG)
- **Que es:** Paginas generadas en build time, HTML estatico
- **Implementar en:** Home page
- **Aprender:**
  - Cuando NO usar SSG (datos frecuentemente cambiantes)
  - Diferencia con ISR
  - Como Next.js decide si una pagina es estatica
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.2 Incremental Static Regeneration (ISR)
- **Que es:** Paginas estaticas que se regeneran periodicamente
- **Implementar en:** Lista de productos, Categorias
- **Aprender:**
  - `export const revalidate = N` (tiempo en segundos)
  - `revalidatePath()` y `revalidateTag()` para on-demand
  - Cache tags para invalidacion granular
  - Stale-while-revalidate behavior
- **Configuracion clave:**
  ```tsx
  // revalidate = 60: Regenera la pagina cada 60 segundos
  // si hay trafico. Sirve contenido stale mientras regenera en background.
  // Beneficio: respuestas siempre rapidas, contenido eventualmente fresco.
  export const revalidate = 60
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.3 Server-Side Rendering (SSR)
- **Que es:** Paginas renderizadas en cada request
- **Implementar en:** Busqueda
- **Aprender:**
  - `export const dynamic = 'force-dynamic'`
  - Cuando usar SSR vs ISR
  - Impacto en TTFB y performance
  - `searchParams` ahora es Promise (await en Next.js 16)
- **Configuracion clave:**
  ```tsx
  // dynamic = 'force-dynamic': Fuerza renderizado en cada request.
  // Necesario cuando dependes de searchParams que cambian constantemente.
  // No tiene sentido cachear porque las combinaciones son infinitas.
  export const dynamic = 'force-dynamic'
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
  - `'use client'` directive
  - Cuando es necesario (useState, useEffect, eventos, browser APIs)
  - Impacto en bundle size (mas Client Components = mas JS)
  - Hidratacion y posibles mismatches
- **Regla:**
  ```tsx
  // 'use client': SOLO usar cuando necesites:
  // - useState, useReducer, useEffect
  // - Event handlers (onClick, onChange, onSubmit)
  // - Browser APIs (localStorage, window, navigator)
  // - Librerias que requieren el navegador
  'use client'
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
  - Como mejora el TTFB y perceived performance
- **Patron clave:**
  ```tsx
  // Suspense permite mostrar contenido parcial mientras otros
  // componentes siguen cargando. El fallback se muestra inmediatamente.
  // Cuando SlowComponent termina, reemplaza el fallback via streaming.
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

### 1.6 generateStaticParams
- **Que es:** Pre-generar rutas dinamicas en build time
- **Implementar en:** Categorias, productos populares
- **Aprender:**
  - `generateStaticParams()` function
  - `dynamicParams = true/false`
  - Estrategia: pre-generar las mas importantes, generar el resto on-demand
- **Configuracion clave:**
  ```tsx
  // dynamicParams = true: Permite generar paginas on-demand
  // para params no incluidos en generateStaticParams.
  // Con false, rutas no pre-generadas retornan 404.
  export const dynamicParams = true

  // generateStaticParams: Pre-genera rutas en build time.
  // Estrategia: generar categorias conocidas, productos populares (top 100).
  // El resto se genera on-demand gracias a dynamicParams = true.
  export async function generateStaticParams() {
    const categories = await getCategories()
    return categories.map(cat => ({ category: cat.slug }))
  }
  ```
- **Estado:** [ ] Pendiente
- **Notas:**
  ```
  [Espacio para tus notas de aprendizaje]
  ```

### 1.7 Cache Components + PPR (Next.js 16)
- **Que es:** Sistema que reemplaza `experimental.ppr`. Permite definir explicitamente que partes son estaticas (cacheables) y cuales dinamicas
- **Implementar en:** Detalle de producto (shell estatico + holes dinamicos)
- **Aprender:**
  - `cacheComponents: true` en next.config.ts (habilita PPR)
  - Directiva `'use cache'` en componentes/funciones
  - `cacheLife()` para definir duracion (perfiles: 'max', 'hours', 'days', 'weeks')
  - `cacheTag()` para invalidacion programatica con `revalidateTag()`
- **Configuracion en next.config.ts:**
  ```ts
  // next.config.ts
  // cacheComponents: true - Habilita el nuevo sistema de Cache Components
  // que incluye PPR (Partial Prerendering). Reemplaza experimental.ppr.
  const nextConfig = {
    cacheComponents: true,
  }
  ```
- **Componente con cache explicito (shell estatico):**
  ```tsx
  // src/components/features/ProductDetail/ProductInfo.tsx

  // 'use cache': Marca este componente como cacheable.
  // Forma parte del "shell estatico" en PPR.
  // El HTML se genera en build/ISR y se sirve instantaneamente.
  'use cache'
  import { cacheLife, cacheTag } from 'next/cache'

  export async function ProductInfo({ productId }: Props) {
    // cacheLife('hours'): Define cuanto tiempo el contenido se considera fresco.
    // Perfiles: 'max' (maximo), 'hours', 'days', 'weeks'
    // Tambien puedes usar custom: cacheLife({ stale: 300, revalidate: 60 })
    cacheLife('hours')

    // cacheTag: Permite invalidar este cache especificamente.
    // Luego puedes llamar revalidateTag('product-123') para invalidar.
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
- **Componente dinamico (hole en PPR):**
  ```tsx
  // src/components/features/ProductDetail/LivePrice.tsx

  // Este componente NO usa 'use cache', por lo que es dinamico.
  // Se renderiza como "hole" en PPR - streaming en cada request.
  // Ideal para datos que cambian frecuentemente (precio, stock).
  export async function LivePrice({ productId }: Props) {
    // fetch sin cache para obtener precio en tiempo real
    const price = await fetchRealTimePrice(productId)
    return (
      // aria-live="polite": Anuncia cambios a lectores de pantalla
      <span aria-live="polite" className="text-2xl font-bold">
        ${price}
      </span>
    )
  }
  ```
- **Patron PPR completo en pagina:**
  ```tsx
  // src/app/products/[category]/[productId]/page.tsx

  // La pagina combina shell estatico + holes dinamicos.
  // PPR envia el shell inmediatamente, luego streama los holes.
  async function ProductPage({ params }) {
    const { productId } = await params // params es Promise en Next.js 16

    return (
      <main>
        {/* Shell estatico - se sirve instantaneamente desde cache */}
        <ProductInfo productId={productId} />

        {/* Holes dinamicos - se streaman cuando esten listos */}
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
  // El metadata se incluye en el <head> del HTML.
  export async function generateMetadata({ params }): Promise<Metadata> {
    const { productId } = await params // params es Promise en Next.js 16
    const product = await getProduct(productId)

    return {
      title: product.name, // Se combina con template del layout
      description: product.description.slice(0, 160), // Max 160 chars
      openGraph: {
        title: product.name,
        description: product.description,
        images: [{ url: product.image, width: 1200, height: 630 }],
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: [product.image],
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
  - Como incluirlo en el HTML
- **Patron:**
  ```tsx
  // JSON-LD se incluye como script en el componente
  // Google lo usa para rich snippets en resultados de busqueda
  function ProductJsonLd({ product }: Props) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
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
  - Prioridades y changeFrequency
  - Que bloquear en robots.txt
- **Sitemap:**
  ```tsx
  // app/sitemap.ts
  // Next.js genera sitemap.xml automaticamente desde este archivo
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts()

    const productUrls = products.map(product => ({
      url: `https://example.com/products/${product.category}/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: 'https://example.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...productUrls,
    ]
  }
  ```
- **Robots.txt:**
  ```tsx
  // app/robots.ts
  // Controla que pueden indexar los buscadores
  export default function robots(): MetadataRoute.Robots {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search?'], // No indexar API ni busquedas
      },
      sitemap: 'https://example.com/sitemap.xml',
    }
  }
  ```
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
  // SkipLink permite saltar directamente al contenido principal
  // Esencial para usuarios de teclado y lectores de pantalla
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
  // "polite" espera a que termine de hablar, "assertive" interrumpe
  <div aria-live="polite" aria-atomic="true">
    {cartCount} productos en el carrito
  </div>

  // role: Define el tipo de elemento para tecnologias asistivas
  <nav role="navigation" aria-label="Menu principal">
  ```
- **Estado:** [ ] Pendiente

### 3.3 Semantic HTML
- **Implementar:** Usar elementos correctos para su proposito
- **Elementos:**
  - `<main>` - Contenido principal (uno por pagina)
  - `<nav>` - Navegacion
  - `<article>` - Contenido independiente (producto, post)
  - `<section>` - Seccion tematica
  - `<header>`, `<footer>` - Cabecera y pie
  - `<h1>`-`<h6>` - Jerarquia de titulos (un h1 por pagina)
- **Estado:** [ ] Pendiente

### 3.4 Imagenes
- **Implementar:** Alt text descriptivo
- **Patron:**
  ```tsx
  // Alt text debe describir el contenido de la imagen
  // Si es decorativa, usar alt="" (vacio, no omitir)
  <Image
    src={product.image}
    alt={`${product.name} - ${product.color} - vista frontal`}
    width={400}
    height={400}
  />

  // Imagen decorativa (icono que acompana texto)
  <Image src="/icons/cart.svg" alt="" aria-hidden="true" />
  ```
- **Estado:** [ ] Pendiente

---

## 4. APIs de Next.js 16

### 4.1 Cambios en params/searchParams
- **Aprender:** Ahora son Promises, requieren `await`
- **Migracion:**
  ```tsx
  // ANTES (Next.js 15)
  function Page({ params }) {
    const { id } = params // Sincrono
  }

  // AHORA (Next.js 16)
  async function Page({ params }) {
    const { id } = await params // Asincrono!
  }

  // searchParams tambien es Promise
  async function SearchPage({ searchParams }) {
    const { q, category } = await searchParams
  }
  ```
- **Estado:** [ ] Pendiente

### 4.2 cookies(), headers(), draftMode()
- **Aprender:** Ahora son async, requieren `await`
- **Migracion:**
  ```tsx
  // ANTES
  const cookieStore = cookies()
  const headersList = headers()

  // AHORA
  const cookieStore = await cookies()
  const headersList = await headers()
  const draft = await draftMode()
  ```
- **Estado:** [ ] Pendiente

### 4.3 Cambios en next.config
- **Aprender:** Nuevas opciones, opciones removidas
- **Removido:**
  - `experimental.ppr` -> usar `cacheComponents: true`
  - `experimental.dynamicIO` -> usar `cacheComponents: true`
  - `next lint` command -> usar `npx eslint .`
- **Estado:** [ ] Pendiente

---

## Registro de Aprendizajes

| Fecha | Concepto | Que aprendi | Archivo de referencia |
|-------|----------|-------------|----------------------|
| | | | |

<!--
Ejemplo:
| 2024-01-15 | ISR | revalidate define tiempo en segundos, regenera en background | products/page.tsx |
| 2024-01-16 | PPR | 'use cache' marca componentes como shell estatico | ProductInfo.tsx |
| 2024-01-17 | a11y | aria-live="polite" para anunciar cambios de precio | LivePrice.tsx |
-->
