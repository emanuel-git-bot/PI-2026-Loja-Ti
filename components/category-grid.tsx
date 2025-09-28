"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import { Cpu, Monitor, HardDrive, Zap } from "lucide-react"

const CATEGORY_ICONS = {
  "1": Cpu,
  "2": Monitor,
  "3": Zap,
  "4": HardDrive,
}

export function CategoryGrid() {
  const { categories, products } = useProducts()

  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((product) => product.categoryId === categoryId && product.inStock).length
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Categorias em Destaque</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || Cpu
            const productCount = getCategoryProductCount(category.id)

            return (
              <Link key={category.id} href={`/loja/produtos?categoria=${category.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{productCount} produtos</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
