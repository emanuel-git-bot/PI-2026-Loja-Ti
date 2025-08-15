"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { ServiceCard } from "@/components/service-card"
import { useProducts } from "@/hooks/use-products"
import { useServices } from "@/hooks/use-services"
import { Monitor, Wrench, ArrowRight, Shield, Truck, Headphones } from "lucide-react"

export default function LojaHomePage() {
  const { products, categories } = useProducts()
  const { services } = useServices()

  const featuredProducts = products.filter((product) => product.inStock).slice(0, 3)
  const featuredServices = services.filter((service) => service.available).slice(0, 3)

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria"
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sua Loja de <span className="text-blue-200">Informática</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Produtos de qualidade e serviços especializados para todas as suas necessidades tecnológicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loja/produtos">
                <Button size="lg" variant="secondary" className="text-blue-700">
                  <Monitor className="h-5 w-5 mr-2" />
                  Ver Produtos
                </Button>
              </Link>
              <Link href="/loja/servicos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-700 bg-transparent"
                >
                  <Wrench className="h-5 w-5 mr-2" />
                  Nossos Serviços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a TechStore?</h2>
            <p className="text-xl text-gray-600">Qualidade, confiança e atendimento especializado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Produtos Originais</h3>
                <p className="text-gray-600">Trabalhamos apenas com produtos originais e com garantia do fabricante</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Headphones className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Suporte Especializado</h3>
                <p className="text-gray-600">
                  Equipe técnica qualificada para te ajudar antes, durante e após a compra
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-gray-600">Entregamos seus produtos com rapidez e segurança em toda a região</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Produtos em Destaque</h2>
              <p className="text-gray-600">Confira nossa seleção de produtos mais populares</p>
            </div>
            <Link href="/loja/produtos">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} categoryName={getCategoryName(product.categoryId)} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum produto disponível no momento.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nossos Serviços</h2>
              <p className="text-gray-600">Assistência técnica especializada para suas necessidades</p>
            </div>
            <Link href="/loja/servicos">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {featuredServices.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhum serviço disponível no momento.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Precisa de Ajuda?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Nossa equipe está pronta para te ajudar a encontrar a solução perfeita
          </p>
          <Link href="/loja/contato">
            <Button size="lg" variant="secondary" className="text-blue-700">
              Entre em Contato
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
