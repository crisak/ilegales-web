# Features del Proyecto

> Actualizar despues de cada sesion de trabajo.

---

## Implementadas

### Setup Inicial
- [x] **Crear proyecto Next.js 16**
  - Next.js 16.1.6 con React 19
  - TypeScript estricto (`strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`)
  - Tailwind CSS v4 con Shadcn UI (estilo new-york)
  - ESLint + Prettier (sin `;`, comillas simples)
  - Turbopack habilitado para desarrollo

- [x] **Configurar next.config.ts**
  - `cacheComponents: true` habilitado para PPR
  - Comentario educativo explicando la configuracion

- [x] **Configurar estructura de carpetas**
  - Estructura segun ARCHITECTURE.md
  - Carpetas: `components/{ui,shared,features}`, `lib/{api,data,utils,constants}`, `hooks/`, `types/`

- [x] **Configurar paleta de colores urbana**
  - Escala de grises oscuros (tema principal, NO dark mode)
  - Estilo stencil/graffiti con alto contraste blanco sobre negro
  - Variables CSS personalizadas en globals.css

**Archivos creados/modificados:**
```
src/
├── app/
│   ├── globals.css          # Paleta urbana + Tailwind v4
│   ├── layout.tsx           # RootLayout con metadata SEO
│   └── page.tsx             # HomePage basica
├── components/
│   ├── ui/                  # (vacio, para Shadcn)
│   ├── shared/              # (vacio)
│   └── features/
│       ├── ProductDetail/   # (vacio)
│       └── Search/          # (vacio)
├── lib/
│   ├── api/                 # (vacio)
│   ├── data/                # (vacio)
│   ├── utils/
│   │   ├── delay.ts         # Simular latencia API
│   │   └── format.ts        # Formatters (precio, fecha)
│   ├── constants/
│   │   └── cache-tags.ts    # Tags para revalidacion
│   └── utils.ts             # cn() de Shadcn
├── hooks/
│   └── useDebounce.ts       # Hook para debounce
└── types/
    ├── product.ts           # Product, ProductWithCategory
    ├── category.ts          # Category
    ├── api.ts               # ApiResponse, SearchParams
    └── index.ts             # Re-exports

Root:
├── next.config.ts           # cacheComponents: true
├── tsconfig.json            # TypeScript estricto
├── eslint.config.mjs        # ESLint + Prettier
├── .prettierrc              # Sin ;, comillas simples
├── postcss.config.mjs       # Tailwind v4
├── components.json          # Shadcn config (zinc)
└── package.json             # Scripts: dev, build, lint, format
```

**Notas:**
- Mock data pendiente (siguiente feature)
- Paleta usa `oklch()` para mejor precision de color
- `baseColor: "zinc"` en Shadcn para consistencia con tema oscuro

### Mock Data
- [x] **Crear mock data**
  - 8 categorias principales con subcategorias
  - 48 productos con datos completos
  - Funciones de acceso a datos (getProducts, getCategories, etc.)
  - Soporte para filtros, ordenamiento y paginacion
  - Precios en COP

**Archivos creados/modificados:**
```
src/
├── types/
│   ├── category.ts          # Subcategory, CategoryWithProductCount
│   └── product.ts           # ProductVariant, campos adicionales
└── lib/
    └── data/
        ├── categories.ts    # 8 categorias con subcategorias
        ├── products.ts      # 48 productos detallados
        └── index.ts         # Funciones de acceso a datos
```

**Categorias implementadas:**
1. Grafiti & Arte Urbano (sprays, caps, marcadores, proteccion, herramientas)
2. Tattoo & Tatuajes (maquinas, consumibles, higiene, transfer, aftercare)
3. Ropa & Moda Urbana (camisetas, hoodies, gorras, pantalones, calzado)
4. Accesorios & Merch (stickers, parches, pins, utilitarios)
5. Musica & DJ (vinilos, equipo-dj, accesorios)
6. Libros & Revistas (arte-tecnica, cultura-hiphop, revistas)
7. Decoracion & Arte (arte-pared, figuras, objetos-deco)
8. Coleccionables & Rarezas (ediciones-limitadas, vintage, arte-exclusivo)

**Funciones de datos disponibles:**
- `getCategories()`, `getCategoriesWithProductCount()`
- `getCategoryBySlug()`, `getCategoryById()`, `getSubcategory()`
- `getProducts(filters, sort, pagination)` - con paginacion completa
- `getProductBySlug()`, `getProductById()`, `getProductWithCategory()`
- `getFeaturedProducts()`, `getNewProducts()`, `getRelatedProducts()`
- `searchProducts()`, `getProductsByCategory()`
- `getBrands()`, `getAllTags()`, `getPopularTags()`
- `getProductStats()` - estadisticas para dashboard

### API Routes
- [x] **GET /api/products**
  - Filtros: category, subcategory, featured, new, minPrice, maxPrice, search, brand, inStock
  - Ordenamiento: price-asc, price-desc, name-asc, name-desc, newest, stock
  - Paginacion completa con page y limit
  - Delay simulado (300-800ms)
  - Cache: 60s con stale-while-revalidate

- [x] **GET /api/products/[id]**
  - Detalle completo con categoria y subcategoria
  - Delay simulado (300-800ms)
  - Cache: 60s con stale-while-revalidate

- [x] **GET /api/products/[id]/price**
  - Precio en tiempo real con variacion simulada (±5%)
  - Delay largo (800-1500ms) para demostrar streaming
  - Sin cache (force-dynamic)

- [x] **GET /api/products/[id]/stock**
  - Stock en tiempo real con variacion simulada
  - Estados: in_stock, low_stock, out_of_stock
  - Delay largo (800-1500ms) para demostrar streaming
  - Sin cache (force-dynamic)

- [x] **GET /api/categories**
  - Lista con conteo de productos
  - Filtro por slug para categoria especifica
  - Cache: 300s (categorias cambian menos)

- [x] **GET /api/search**
  - Busqueda avanzada con filtros completos
  - Facetas: categorias, marcas, tags populares
  - Ordenamiento por relevancia, precio, fecha, nombre
  - Cache: 30s

- [x] **POST /api/revalidate**
  - Webhook para on-demand revalidation
  - Autenticacion por token secreto
  - Tipos: products, product, product-price, product-stock, categories, category, search, all
  - Soporte para tags personalizados

**Archivos creados:**
```
src/app/api/
├── products/
│   ├── route.ts              # GET /api/products
│   └── [id]/
│       ├── route.ts          # GET /api/products/[id]
│       ├── price/
│       │   └── route.ts      # GET /api/products/[id]/price
│       └── stock/
│           └── route.ts      # GET /api/products/[id]/stock
├── categories/
│   └── route.ts              # GET /api/categories
├── search/
│   └── route.ts              # GET /api/search
└── revalidate/
    └── route.ts              # POST /api/revalidate
```

---

## En Progreso

_Ninguna feature en progreso._

---

## Pendientes

### Paginas
- [ ] **Home page** (`/`)
  - Tipo: SSG
  - Hero section
  - Categorias destacadas
  - Productos destacados

- [ ] **Lista de productos** (`/products`)
  - Tipo: ISR (revalidate: 60)
  - Grid de productos
  - Paginacion
  - generateStaticParams para pre-generar

- [ ] **Categoria** (`/products/[category]`)
  - Tipo: ISR (revalidate: 60)
  - Filtrado por categoria
  - generateStaticParams para categorias conocidas
  - dynamicParams = true para nuevas categorias

- [ ] **Detalle de producto** (`/products/[category]/[productId]`)
  - Tipo: ISR + Streaming + PPR
  - Shell estatico: ProductInfo con 'use cache'
  - Holes dinamicos: LivePrice, StockLevel
  - generateStaticParams para productos populares

- [ ] **Busqueda** (`/search`)
  - Tipo: SSR (force-dynamic)
  - SearchBar (Client Component)
  - Filtros (Client Component)
  - Resultados (Server Component)

### Componentes UI
- [ ] Button (variantes: primary, secondary, outline)
- [ ] Card (para productos)
- [ ] Skeleton (para loading states)
- [ ] Input (con label y error state)
- [ ] Badge (para categorias, stock)
- [ ] Select (para filtros)

### Componentes Shared
- [ ] Header (con navegacion y SearchBar)
- [ ] Footer
- [ ] Breadcrumbs
- [ ] SkipLink (accesibilidad)

### Componentes Features
- [ ] ProductCard
- [ ] ProductGrid
- [ ] ProductDetail/ProductInfo (con 'use cache')
- [ ] ProductDetail/ProductImages
- [ ] ProductDetail/LivePrice (dinamico)
- [ ] ProductDetail/StockLevel (dinamico)
- [ ] ProductDetail/ImageGallery (Client Component)
- [ ] Search/SearchBar (Client Component)
- [ ] Search/SearchResults
- [ ] Search/Filters (Client Component)

### SEO
- [ ] **generateMetadata en cada pagina**
  - Title con template
  - Description unica
  - Open Graph tags
  - Twitter Cards

- [ ] **JSON-LD para productos**
  - Schema.org/Product
  - Precio, disponibilidad, rating

- [ ] **JSON-LD para breadcrumbs**
  - Schema.org/BreadcrumbList

- [ ] **Sitemap dinamico**
  - app/sitemap.ts
  - Incluir todas las paginas publicas

- [ ] **Robots.txt**
  - app/robots.ts
  - Bloquear /api/, /search con params

### Accesibilidad
- [ ] **Skip links**
  - Saltar al contenido principal
  - Saltar a navegacion

- [ ] **ARIA labels**
  - En todos los botones e inputs
  - En navegacion
  - aria-live para contenido dinamico

- [ ] **Focus states**
  - Visibles en todos los elementos interactivos
  - Outline con buen contraste

- [ ] **Semantic HTML**
  - main, nav, article, section, header, footer
  - Headings jerarquicos (h1, h2, h3)

- [ ] **Alt text**
  - Descriptivo en todas las imagenes de productos

---

## Backlog / Ideas Futuras

- [ ] Dark mode
- [ ] Internacionalizacion (i18n)
- [ ] PWA support
- [ ] E2E tests con Playwright
- [ ] Animaciones con Framer Motion
- [ ] Reviews/ratings de productos

---

## Registro de Sesiones

| Fecha | Que se hizo | Archivos modificados |
|-------|-------------|---------------------|
| - | Documentacion inicial completada | CLAUDE.md, docs/* |
| 2025-01-30 | Setup inicial: Next.js 16, TypeScript, Tailwind, ESLint, Prettier, Shadcn, estructura de carpetas, paleta urbana | next.config.ts, tsconfig.json, eslint.config.mjs, .prettierrc, postcss.config.mjs, components.json, package.json, src/app/*, src/lib/*, src/types/*, src/hooks/* |
| 2026-01-30 | Mock Data: 8 categorias, 48 productos, funciones de acceso con filtros/paginacion | src/types/category.ts, src/types/product.ts, src/lib/data/* |
| 2026-01-30 | API Routes: 7 endpoints REST con filtros, paginacion, streaming y revalidacion | src/app/api/* |
