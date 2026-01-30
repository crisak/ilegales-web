// cache-tags.ts: Tags centralizados para revalidacion on-demand.
// Usar con revalidateTag() para invalidar cache de forma granular.

export const CACHE_TAGS = {
  // Productos
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product-${id}`,
  PRODUCT_PRICE: (id: string) => `product-price-${id}`,
  PRODUCT_STOCK: (id: string) => `product-stock-${id}`,

  // Categorias
  CATEGORIES: 'categories',
  CATEGORY: (slug: string) => `category-${slug}`,

  // Busqueda
  SEARCH: 'search',
} as const
