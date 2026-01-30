import type { Category } from './category'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  categoryId: string
  stock: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductWithCategory extends Product {
  category: Category
}
