export type Category = { id: number; name: string; slug: string }

export type AppItem = {
  id: number
  name: string
  developerName: string
  description: string
  iconUrl?: string
  installsCount: number
  ratingAvg: number
  ratingCount: number
  createdAt?: string
  categories: Category[]
  screenshots: string[]
}

export type Review = {
  id: number
  rating: number
  comment?: string
  authorEmail: string
  createdAt: string
}

export type Page<T> = {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
