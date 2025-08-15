"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { useProducts } from "@/hooks/use-products"
import { useServices } from "@/hooks/use-services"
import { BarChart3, PieChart, TrendingUp, DollarSign } from "lucide-react"

export default function ReportsPage() {
  const { products, categories } = useProducts()
  const { services } = useServices()

  const totalProductValue = products.reduce((sum, product) => sum + product.price, 0)
  const totalServiceValue = services.reduce((sum, service) => sum + service.price, 0)
  const averageProductPrice = products.length > 0 ? totalProductValue / products.length : 0
  const averageServicePrice = services.length > 0 ? totalServiceValue / services.length : 0

  const categoryStats = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.categoryId === category.id)
    const categoryValue = categoryProducts.reduce((sum, product) => sum + product.price, 0)
    return {
      name: category.name,
      productCount: categoryProducts.length,
      totalValue: categoryValue,
      averagePrice: categoryProducts.length > 0 ? categoryValue / categoryProducts.length : 0,
    }
  })

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Relatórios" }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise detalhada do seu negócio</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Valor Total Produtos"
          value={`R$ ${totalProductValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description="valor total do estoque"
          icon={DollarSign}
        />
        <StatsCard
          title="Preço Médio Produto"
          value={`R$ ${averageProductPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description="preço médio por produto"
          icon={TrendingUp}
        />
        <StatsCard
          title="Valor Total Serviços"
          value={`R$ ${totalServiceValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description="valor total dos serviços"
          icon={DollarSign}
        />
        <StatsCard
          title="Preço Médio Serviço"
          value={`R$ ${averageServicePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description="preço médio por serviço"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Análise por Categoria
            </CardTitle>
            <CardDescription>Distribuição de produtos e valores por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{category.name}</h4>
                    <span className="text-sm text-gray-500">{category.productCount} produtos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Valor Total</p>
                      <p className="font-medium">
                        R$ {category.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Preço Médio</p>
                      <p className="font-medium">
                        R$ {category.averagePrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {categoryStats.length === 0 && (
                <p className="text-center text-gray-500 py-4">Nenhuma categoria encontrada.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Produtos Mais Caros
            </CardTitle>
            <CardDescription>Top 5 produtos com maior valor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .sort((a, b) => b.price - a.price)
                .slice(0, 5)
                .map((product, index) => {
                  const category = categories.find((cat) => cat.id === product.categoryId)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{category?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              {products.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum produto encontrado.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Serviços</CardTitle>
          <CardDescription>Visão geral dos serviços oferecidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">{service.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-medium">
                      R$ {service.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={service.available ? "text-green-600" : "text-red-600"}>
                      {service.available ? "Disponível" : "Indisponível"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">Nenhum serviço encontrado.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
