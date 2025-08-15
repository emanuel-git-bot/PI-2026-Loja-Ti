export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  inStock: boolean
  specifications: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  available: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
