# Features del Proyecto

> Actualizar despues de cada sesion de trabajo.

---

## Implementadas

_Ninguna feature implementada aun._

---

## En Progreso

_Ninguna feature en progreso._

---

## Pendientes

### Setup Inicial
- [ ] **Crear proyecto Next.js 16**
  - Prioridad: Alta
  - Requisitos: Node.js 22.21+, pnpm, TypeScript, Tailwind CSS, ESLint, Prettier, Shadcn UI

- [ ] **Configurar next.config.ts**
  - Prioridad: Alta
  - Habilitar `cacheComponents: true` para PPR

- [ ] **Configurar estructura de carpetas**
  - Prioridad: Alta
  - Segun arquitectura definida en ARCHITECTURE.md

- [ ] **Crear mock data**
  - Prioridad: Alta
  - Productos y categorias en JSON

### API Routes
- [ ] **GET /api/products**
  - Con delay simulado (300-800ms)
  - Filtros por categoria

- [ ] **GET /api/products/[id]**
  - Detalle de producto
  - Con delay simulado

- [ ] **GET /api/products/[id]/price**
  - Precio en tiempo real (para streaming/PPR)
  - Delay mas largo para demostrar streaming

- [ ] **GET /api/products/[id]/stock**
  - Stock en tiempo real (para streaming/PPR)
  - Delay mas largo para demostrar streaming

- [ ] **GET /api/categories**
  - Lista de categorias

- [ ] **GET /api/search**
  - Busqueda con filtros (query, categoria, precio min/max, ordenamiento)

- [ ] **POST /api/revalidate**
  - Webhook para on-demand revalidation
  - Usar revalidateTag()

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
| | Documentacion inicial completada | CLAUDE.md, docs/* |
