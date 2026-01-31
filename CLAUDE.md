# Instrucciones para Claude

## Sobre el Proyecto
- **Nombre:** ILEGALES
- **Detalles adicionales de la tienda:**
```
ILEGALES
ILEGALES TIENDA URBANA
Tattoo/Graffiti
Galería
Artículos y Accesorios
Stickers
Whastapp 3123574867
```
- **Stack:** Next.js 16(Using App Router), TypeScript, Tailwind CSS
- **Objetivo:** POC educativo para aprender renderizado, SEO y accesibilidad en Next.js

## Objetivos de Aprendizaje
1. Comprender los diferentes tipos de renderizado (SSG, SSR, ISR, CSR, Streaming, PPR)
2. Implementar SEO correctamente (metadata, JSON-LD, sitemap, robots.txt)
3. Aplicar buenas practicas de accesibilidad (WCAG)
4. Usar correctamente Server y Client Components

## Reglas de Codigo
- **Lenguaje:** TypeScript estricto (sin `any`, strict mode)
- **Estilos:** Tailwind CSS
- **Formater:** Prettier (sin ";", con comillas simples ')
- **Componentes:** Server Components por defecto, Client solo cuando sea necesario
- **Nombrado:** Ver `docs/CONVENTIONS.md`

## Regla Especial: Comentarios Educativos
Cuando uses configuraciones clave de Next.js, SIEMPRE deja un comentario explicativo:
```tsx
// dynamicParams = true: Permite generar paginas bajo demanda para params
// que no fueron pre-generados en build time. Sin esto, rutas no pre-generadas
// retornarian 404.
export const dynamicParams = true
```

## Arquitectura
- **Renderizado:** Depende del caso de uso (ver `docs/ARCHITECTURE.md`)
- **Estructura:** App Router con carpeta `src/`
- **API:** Route Handlers en `app/api/` con mock data + delays simulados

## Empaquetador
Usar `pnpm` y configurar el proyecto con `pnpm` unicamente

## Comandos
```bash
pnpm dev      # Desarrollo (Turbopack)
pnpm build    # Build de produccion
pnpm start    # Servidor de produccion
pnpm lint     # Correr eslint
```

## Pantallas del Proyecto
- Lista de productos (`/products`)
- Categoria (`/products/[category]`)
- Detalle de producto (`/products/[category]/[productId]`)
- Busqueda con filtros (`/search`)

**Excluidas de la demo:** Carrito, Checkout, Account

## Documentacion
- `docs/ARCHITECTURE.md` - Decisiones de renderizado y estructura
- `docs/CONVENTIONS.md` - Convenciones de codigo
- `docs/FEATURES.md` - Estado actual de features
- `docs/LEARNING_GOALS.md` - Objetivos de aprendizaje

## NO Hacer
- No usar `any` en TypeScript
- No usar `'use client'` sin justificacion documentada
- No olvidar atributos de accesibilidad (aria-*, roles, alt text, ...)
- No hacer fetch en Client Components si puede hacerse en Server
- No usar configuraciones de Next.js sin comentario explicativo
- No ignorar errores de TypeScript, Prettier o ESLint
