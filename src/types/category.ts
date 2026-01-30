export interface Subcategory {
  id: string
  name: string
  slug: string
  description: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon?: string
  subcategories: Subcategory[]
}

export interface CategoryWithProductCount extends Category {
  productCount: number
}
