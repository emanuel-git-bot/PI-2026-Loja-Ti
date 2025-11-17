export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  createdAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  cpf: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: Date
  updatedAt: Date
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
  featured?: boolean // adicionando campo featured para marcar produtos em destaque
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

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchaseAmount: number
  maxDiscountAmount?: number
  startDate: Date
  endDate: Date
  usageLimit: number
  usageCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: CartItem[]
  subtotal: number
  discount: number
  couponCode?: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "mercadopago"
  paymentStatus: "pending" | "approved" | "rejected"
  paymentId?: string
  shippingAddress: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface OrderStatus {
  status: Order["status"]
  label: string
  description: string
  timestamp: Date
}

export interface ServiceOrder {
  id: string
  userId: string
  userName: string
  userEmail: string
  serviceId: string
  service: Service
  description: string
  scheduledDate?: Date
  status: "requested" | "analyzing" | "approved" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  estimatedCost?: number
  finalCost?: number
  notes?: string
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceOrderStatus {
  status: ServiceOrder["status"]
  label: string
  description: string
  timestamp: Date
}

export type MessageType = "text" | "order" | "service" | "deal" | "coupon"

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "admin" | "user"
  message: string
  messageType: MessageType
  imageUrl?: string
  // Dados específicos para cada tipo de mensagem
  orderData?: {
    orderId: string
    status: Order["status"]
    total: number
  }
  serviceData?: {
    serviceId: string
    serviceName: string
    status: string
  }
  dealData?: {
    dealId: string
    productName: string
    discountPercentage: number
    originalPrice: number
    discountedPrice: number
  }
  couponData?: {
    couponId: string
    code: string
    discountType: "percentage" | "fixed"
    discountValue: number
    expiresAt: Date
  }
  isRead: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastMessage?: string
  lastMessageAt: Date
  unreadCount: number
  createdAt: Date
}
