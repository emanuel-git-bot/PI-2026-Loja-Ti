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
  imageUrls: string[]
  barcode?: string
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

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  addedAt: Date
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getCartItem: (productId: string) => CartItem | undefined
}

export interface FavoritesContextType {
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number // 1-5 estrelas
  comment: string
  imageUrls?: string[] // imagens opcionais na avaliação
  createdAt: Date
  updatedAt: Date
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface Deal {
  id: string
  productId: string
  product?: Product
  discountPercentage: number
  originalPrice: number
  discountedPrice: number
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeroBanner {
  id: string
  title: string
  subtitle: string
  description: string
  cta: string
  link: string
  imageUrl: string
  bgColor: string
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}
