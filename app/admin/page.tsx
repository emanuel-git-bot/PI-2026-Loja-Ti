"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { useProducts } from "@/hooks/use-products"
import { useServices } from "@/hooks/use-services"
import { Monitor, Wrench, TrendingUp, Package, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const { products, categories } = useProducts()
  const { services } = useServices()

  const totalProducts = products.length
  const productsInStock = products.filter((p) => p.inStock).length
  const productsOutOfStock = products.filter((p) => !p.inStock).length
  const totalServices = services.length
  const availableServices = services.filter((s) => s.available).length
  const totalCategories = categories.length

  const totalProductValue = products.reduce((sum, product) => sum + product.price, 0)
  const averageProductPrice = totalProducts > 0 ? totalProductValue / totalProducts : 0

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria não encontrada"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Produtos"
          value={totalProducts}
          description="produtos cadastrados"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Produtos em Estoque"
          value={productsInStock}
          description="disponíveis para venda"
          icon={Monitor}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Serviços Ativos"
          value={availableServices}
          description="serviços disponíveis"
          icon={Wrench}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Valor Médio"
          value={`R$ ${averageProductPrice.toFixed(0)}`}
          description="preço médio dos produtos"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produtos Recentes</CardTitle>
            <CardDescription>Últimos produtos adicionados ao catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                    <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                      {product.inStock ? "Em estoque" : "Fora de estoque"}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhum produto cadastrado ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Em Estoque</span>
                <span className="font-medium text-green-600">{productsInStock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fora de Estoque</span>
                <span className="font-medium text-red-600">{productsOutOfStock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categorias</span>
                <span className="font-medium">{totalCategories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Serviços</span>
                <span className="font-medium">{totalServices}</span>
              </div>
            </CardContent>
          </Card>

          {productsOutOfStock > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Atenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700">
                  Você tem {productsOutOfStock} produto(s) fora de estoque. Considere reabastecer ou remover do
                  catálogo.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                <div className="text-sm p-2 bg-blue-50 rounded text-blue-700">
                  <strong>Produtos:</strong> {totalProducts} cadastrados
                </div>
                <div className="text-sm p-2 bg-green-50 rounded text-green-700">
                  <strong>Serviços:</strong> {availableServices} disponíveis
                </div>
                <div className="text-sm p-2 bg-purple-50 rounded text-purple-700">
                  <strong>Categorias:</strong> {totalCategories} ativas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
