"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"
import { Search } from "lucide-react"

export default function ProdutosPage() {
  const { products, categories } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const availableProducts = products.filter((product) => product.inStock)

  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria"
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nossos Produtos</h1>
          <p className="text-gray-600">Encontre os melhores componentes e equipamentos de informática</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} categoryName={getCategoryName(product.categoryId)} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm || selectedCategory !== "all"
                  ? "Nenhum produto encontrado para os filtros selecionados."
                  : "Nenhum produto disponível no momento."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
