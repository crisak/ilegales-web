import type {
  Category,
  CategoryWithProductCount,
  Subcategory,
} from '@/types/category'
import type { Product, ProductWithCategory } from '@/types/product'

import { categories } from './categories'
import { products } from './products'

// ==========================================
// CATEGORÍAS
// ==========================================

export function getCategories(): Category[] {
  return categories
}

export function getCategoriesWithProductCount(): CategoryWithProductCount[] {
  return categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryId === category.id).length,
  }))
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getSubcategory(
  categoryId: string,
  subcategorySlug: string
): Subcategory | undefined {
  const category = getCategoryById(categoryId)
  return category?.subcategories.find((s) => s.slug === subcategorySlug)
}

// ==========================================
// PRODUCTOS
// ==========================================

export interface ProductFilters {
  categoryId?: string
  subcategoryId?: string
  featured?: boolean
  isNew?: boolean
  minPrice?: number
  maxPrice?: number
  search?: string
  tags?: string[]
  brand?: string
  inStock?: boolean
}

export interface ProductSortOptions {
  field: 'price' | 'name' | 'createdAt' | 'stock'
  order: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function getProducts(
  filters?: ProductFilters,
  sort?: ProductSortOptions,
  pagination?: PaginationOptions
): PaginatedResult<Product> {
  let filtered = [...products]

  // Aplicar filtros
  if (filters) {
    if (filters.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === filters.categoryId)
    }
    if (filters.subcategoryId) {
      filtered = filtered.filter(
        (p) => p.subcategoryId === filters.subcategoryId
      )
    }
    if (filters.featured !== undefined) {
      filtered = filtered.filter((p) => p.featured === filters.featured)
    }
    if (filters.isNew !== undefined) {
      filtered = filtered.filter((p) => p.isNew === filters.isNew)
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      )
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      )
    }
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand)
    }
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.stock > 0)
    }
  }

  // Aplicar ordenamiento
  if (sort) {
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sort.field) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'stock':
          comparison = a.stock - b.stock
          break
      }
      return sort.order === 'desc' ? -comparison : comparison
    })
  }

  // Aplicar paginación
  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? 12
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: filtered.slice(startIndex, endIndex),
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductWithCategory(
  id: string
): ProductWithCategory | undefined {
  const product = getProductById(id)
  if (!product) return undefined

  const category = getCategoryById(product.categoryId)
  if (!category) return undefined

  const subcategory = product.subcategoryId
    ? getSubcategory(product.categoryId, product.subcategoryId)
    : undefined

  return {
    ...product,
    category,
    subcategory,
  }
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit)
}

export function getNewProducts(limit = 8): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit)
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId)
  if (!product) return []

  return products
    .filter((p) => p.id !== productId && p.categoryId === product.categoryId)
    .slice(0, limit)
}

export function getProductsByCategory(
  categoryId: string,
  limit?: number
): Product[] {
  const filtered = products.filter((p) => p.categoryId === categoryId)
  return limit ? filtered.slice(0, limit) : filtered
}

export function searchProducts(query: string, limit = 20): Product[] {
  const queryLower = query.toLowerCase()
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(queryLower) ||
        p.shortDescription.toLowerCase().includes(queryLower) ||
        p.tags.some((t) => t.toLowerCase().includes(queryLower)) ||
        p.brand?.toLowerCase().includes(queryLower)
    )
    .slice(0, limit)
}

// ==========================================
// ESTADÍSTICAS (útil para admin/dashboard)
// ==========================================

export function getProductStats() {
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const outOfStock = products.filter((p) => p.stock === 0).length
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const featuredCount = products.filter((p) => p.featured).length
  const newCount = products.filter((p) => p.isNew).length

  const priceRange = {
    min: Math.min(...products.map((p) => p.price)),
    max: Math.max(...products.map((p) => p.price)),
    avg: Math.round(
      products.reduce((sum, p) => sum + p.price, 0) / totalProducts
    ),
  }

  const byCategory = categories.map((c) => ({
    category: c.name,
    count: products.filter((p) => p.categoryId === c.id).length,
  }))

  return {
    totalProducts,
    totalStock,
    outOfStock,
    lowStock,
    featuredCount,
    newCount,
    priceRange,
    byCategory,
  }
}

// ==========================================
// MARCAS
// ==========================================

export function getBrands(): string[] {
  const brands = new Set<string>()
  products.forEach((p) => {
    if (p.brand) brands.add(p.brand)
  })
  return Array.from(brands).sort()
}

// ==========================================
// TAGS
// ==========================================

export function getAllTags(): string[] {
  const tags = new Set<string>()
  products.forEach((p) => {
    p.tags.forEach((t) => tags.add(t))
  })
  return Array.from(tags).sort()
}

export function getPopularTags(limit = 10): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>()
  products.forEach((p) => {
    p.tags.forEach((t) => {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    })
  })

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// Re-exportar los datos crudos para casos especiales
export { categories, products }
