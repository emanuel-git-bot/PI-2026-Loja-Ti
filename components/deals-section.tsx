"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"
import { Clock, Flame } from "lucide-react"
import Link from "next/link"

export function DealsSection() {
  const { products, categories } = useProducts()

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria"
  }

  // Simulate deals - in a real app, this would come from your backend
  const dealsProducts = products.filter((product) => product.inStock).slice(0, 4)

  return (
    <section className="py-8 bg-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-promotion text-promotion-foreground p-2 rounded-full">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ofertas do Dia</h2>
              <p className="text-muted-foreground">Promoções por tempo limitado</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Termina em 23:45:12</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealsProducts.map((product) => (
            <div key={product.id} className="relative">
              <Badge className="absolute top-2 left-2 z-10 bg-promotion text-promotion-foreground">-25%</Badge>
              <ProductCard
                product={{
                  ...product,
                  price: product.price * 0.75, // Simulate discount
                }}
                categoryName={getCategoryName(product.categoryId)}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/loja/produtos">
            <Button variant="outline" size="lg">
              Ver Todas as Ofertas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
