import type { Category, Subcategory } from './category'

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  compareAtPrice?: number
  images: string[]
  categoryId: string
  subcategoryId?: string
  stock: number
  sku: string
  tags: string[]
  brand?: string
  variants?: ProductVariant[]
  featured: boolean
  isNew: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductWithCategory extends Product {
  category: Category
  subcategory?: Subcategory
}
