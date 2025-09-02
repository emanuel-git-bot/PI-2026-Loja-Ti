// Tipos para respostas da API Python
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
  count?: number
  next?: string
  previous?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
  field_errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Tipos específicos para a API da loja
export interface ApiCategory {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface ApiProduct {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  category: ApiCategory
  image_url?: string
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApiService {
  id: string
  name: string
  description: string
  price: number
  duration: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApiUser {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: ApiUser
}
