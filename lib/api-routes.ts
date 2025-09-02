const BASE_URL = "http://127.0.0.1:8000"

const API_ROUTES = {
  // Categorias
  categorias: `${BASE_URL}/api/categorias/`,
  categoriaById: (id: string) => `${BASE_URL}/api/categorias/${id}/`,

  // Produtos
  produtos: `${BASE_URL}/api/produtos/`,
  produtoById: (id: string) => `${BASE_URL}/api/produtos/${id}/`,
  produtosByCategoria: (categoriaId: string) => `${BASE_URL}/api/produtos/?categoria=${categoriaId}`,

  // Serviços
  servicos: `${BASE_URL}/api/servicos/`,
  servicoById: (id: string) => `${BASE_URL}/api/servicos/${id}/`,

  // Autenticação (caso precise)
  auth: {
    login: `${BASE_URL}/api/auth/login/`,
    logout: `${BASE_URL}/api/auth/logout/`,
    register: `${BASE_URL}/api/auth/register/`,
    me: `${BASE_URL}/api/auth/me/`,
  },

  // Relatórios (caso precise)
  reports: {
    dashboard: `${BASE_URL}/api/reports/dashboard/`,
    produtos: `${BASE_URL}/api/reports/produtos/`,
    servicos: `${BASE_URL}/api/reports/servicos/`,
  },
}

export default API_ROUTES
