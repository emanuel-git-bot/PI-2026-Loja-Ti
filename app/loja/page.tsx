"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { HeroCarousel } from "@/components/hero-carousel"
import { CategoryGrid } from "@/components/category-grid"
import { DealsSection } from "@/components/deals-section"
import { PromotionalBanners } from "@/components/promotional-banners"
import { EnhancedServicesSection } from "@/components/enhanced-services-section"
import { MobileGridControl } from "@/components/mobile-grid-control"
import { useMobileGridColumns } from "@/hooks/use-mobile-grid-columns"
import { useProducts } from "@/hooks/use-products"
import { ArrowRight, Shield, Truck, Headphones, Star, TrendingUp, Gift, Mail } from 'lucide-react'

export default function LojaHomePage() {
  const { products, categories } = useProducts()
  const { gridClass } = useMobileGridColumns()

  const featuredProducts = products.filter((product) => product.inStock).slice(0, 8)
  const bestSellers = products.filter((product) => product.inStock).slice(2, 6)

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria"
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeroCarousel />
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Deals Section */}
      <DealsSection />

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Produtos Originais</h3>
              <p className="text-muted-foreground text-sm">Garantia do fabricante em todos os produtos</p>
            </div>

            <div className="text-center">
              <div className="bg-info/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-info" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-muted-foreground text-sm">Frete grátis acima de R$ 299 para todo o Brasil</p>
            </div>

            <div className="text-center">
              <div className="bg-warning/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Suporte 24/7</h3>
              <p className="text-muted-foreground text-sm">Atendimento especializado sempre que precisar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Best Sellers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-2 rounded-full">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Mais Vendidos</h2>
                <p className="text-muted-foreground">Os produtos preferidos dos nossos clientes</p>
              </div>
            </div>
            <Link href="/loja/produtos">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className={`grid ${gridClass} md:grid-cols-2 lg:grid-cols-4 gap-6`}>
            {bestSellers.map((product, index) => (
              <div key={product.id} className="relative">
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 z-10 bg-warning text-warning-foreground">
                    #1 Mais Vendido
                  </Badge>
                )}
                <ProductCard product={product} categoryName={getCategoryName(product.categoryId)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Produtos em Destaque</h2>
                <p className="text-muted-foreground">Seleção especial da nossa equipe</p>
              </div>
            </div>
            <Link href="/loja/produtos">
              <Button variant="outline">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className={`grid ${gridClass} md:grid-cols-2 lg:grid-cols-4 gap-6`}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} categoryName={getCategoryName(product.categoryId)} />
            ))}
          </div>
        </div>
      </section>

      <EnhancedServicesSection />

      {/* Newsletter Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Receba Ofertas Exclusivas</h2>
            <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
              Cadastre-se em nossa newsletter e seja o primeiro a saber sobre promoções, lançamentos e dicas técnicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full px-4 py-3 rounded-lg text-foreground bg-white border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>
              <Button size="lg" variant="secondary" className="text-primary font-semibold">
                <Mail className="h-5 w-5 mr-2" />
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MobileGridControl />
    </div>
  )
}
