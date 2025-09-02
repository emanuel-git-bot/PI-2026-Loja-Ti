import API_ROUTES from "./api-routes"

interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

interface ApiError {
  message: string
  status: number
  details?: any
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = "http://127.0.0.1:8000"
    // Recuperar token do localStorage se existir
    this.token = localStorage.getItem("auth_token")
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  removeToken() {
    this.token = null
    localStorage.removeItem("auth_token")
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          message: data.message || "Erro na requisição",
          status: response.status,
          details: data,
        } as ApiError
      }

      return {
        data,
        status: response.status,
        message: data.message,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
        } as ApiError
      }
      throw error
    }
  }

  // Métodos GET
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "GET" })
  }

  // Métodos POST
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Métodos PUT
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Métodos DELETE
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: "DELETE" })
  }

  // Métodos específicos para Categorias
  async getCategorias() {
    return this.get(API_ROUTES.categorias)
  }

  async createCategoria(categoria: any) {
    return this.post(API_ROUTES.categorias, categoria)
  }

  async updateCategoria(id: string, categoria: any) {
    return this.put(API_ROUTES.categoriaById(id), categoria)
  }

  async deleteCategoria(id: string) {
    return this.delete(API_ROUTES.categoriaById(id))
  }

  // Métodos específicos para Produtos
  async getProdutos() {
    return this.get(API_ROUTES.produtos)
  }

  async getProdutosByCategoria(categoriaId: string) {
    return this.get(API_ROUTES.produtosByCategoria(categoriaId))
  }

  async createProduto(produto: any) {
    return this.post(API_ROUTES.produtos, produto)
  }

  async updateProduto(id: string, produto: any) {
    return this.put(API_ROUTES.produtoById(id), produto)
  }

  async deleteProduto(id: string) {
    return this.delete(API_ROUTES.produtoById(id))
  }

  // Métodos específicos para Serviços
  async getServicos() {
    return this.get(API_ROUTES.servicos)
  }

  async createServico(servico: any) {
    return this.post(API_ROUTES.servicos, servico)
  }

  async updateServico(id: string, servico: any) {
    return this.put(API_ROUTES.servicoById(id), servico)
  }

  async deleteServico(id: string) {
    return this.delete(API_ROUTES.servicoById(id))
  }
}

export const apiClient = new ApiClient()
export default apiClient
