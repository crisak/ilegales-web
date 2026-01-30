# Convenciones de Codigo

## Nombrado de Archivos

| Tipo | Convencion | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Paginas (App Router) | kebab-case carpeta + `page.tsx` | `productos/page.tsx` |
| Hooks | camelCase con prefijo `use` | `useCart.ts` |
| Utilidades | camelCase | `formatPrice.ts` |
| Tipos | PascalCase | `Product.ts` o en `types/index.ts` |
| Constantes | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |

---

## Estructura de Componentes

```tsx
// 1. Directiva (si es Client Component)
'use client'

// 2. Imports - ordenados por:
//    - React/Next
//    - Librerias externas
//    - Componentes internos
//    - Utilidades/hooks
//    - Tipos
//    - Estilos
import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

// 3. Types/Interfaces del componente
interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

// 4. Componente
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // hooks primero
  const { addItem } = useCart()

  // estado local
  const [isLoading, setIsLoading] = useState(false)

  // handlers
  const handleAddToCart = () => {
    setIsLoading(true)
    addItem(product.id)
    onAddToCart?.()
  }

  // render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 5. Exports adicionales (si los hay)
export type { ProductCardProps }
```

---

## Server vs Client Components

### Usar Server Component (default) cuando:
- Fetch de datos
- Acceso a recursos del backend
- Informacion sensible (API keys, tokens)
- Dependencias grandes que no necesitan ir al cliente
- Sin interactividad del usuario

### Usar Client Component (`'use client'`) cuando:
- `useState`, `useEffect`, `useReducer` son necesarios
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs (localStorage, window, etc.)
- Hooks personalizados que usan estado
- Librerias que requieren el navegador

---

## Tipos TypeScript

### Interfaces vs Types
```tsx
// Usar interface para objetos/props de componentes
interface ProductProps {
  id: string
  name: string
}

// Usar type para unions, intersections, utilidades
type ProductStatus = 'active' | 'inactive' | 'draft'
type ProductWithStatus = Product & { status: ProductStatus }
```

### Ubicacion de Tipos
- **Tipos locales:** En el mismo archivo si solo se usa ahi
- **Tipos compartidos:** En `src/types/`
- **Tipos de componente:** Junto al componente o exportados

---

## Imports con Alias

```tsx
// Usar alias @ para imports absolutos
import { Button } from '@/components/ui/Button'  // Correcto
import { Button } from '../../../components/ui/Button'  // Evitar
```

---

## Manejo de Errores

```tsx
// En Server Components
async function ProductPage({ id }: Props) {
  const product = await getProduct(id)

  if (!product) {
    notFound() // Next.js 404
  }

  return <ProductDetail product={product} />
}

// En Client Components
function AddToCartButton() {
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    try {
      await addToCart()
    } catch (e) {
      setError('Error al agregar al carrito')
    }
  }
}
```

---

## Comentarios

```tsx
// Comentarios de una linea para explicaciones breves

/**
 * Comentarios de bloque para:
 * - Funciones complejas
 * - Documentacion de API
 * - TODOs importantes
 */

// TODO: [descripcion de la tarea pendiente]
// FIXME: [descripcion del bug a corregir]
// HACK: [explicacion de solucion temporal]
```

---

## Git Commits
[completar: convenciones de commits - Conventional Commits, etc.]

```
feat: agregar carrito de compras
fix: corregir calculo de precio total
docs: actualizar ARCHITECTURE.md
refactor: extraer logica de producto a hook
```
