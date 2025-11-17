"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useFavorites } from "@/contexts/favorites-context"
import { useProducts } from "@/hooks/use-products"
import { Heart, ArrowLeft } from "lucide-react"

export default function FavoritosPage() {
  const { favorites, clearFavorites } = useFavorites()
  const { categories } = useProducts()

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria"
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nenhum favorito ainda</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Adicione produtos aos seus favoritos para vê-los aqui!
            </p>
            <Link href="/loja/produtos">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/loja/produtos"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Favoritos</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length} {favorites.length === 1 ? "produto favorito" : "produtos favoritos"}
              </p>
            </div>
            {favorites.length > 0 && (
              <Button variant="outline" onClick={clearFavorites}>
                Limpar Favoritos
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} categoryName={getCategoryName(product.categoryId)} />
          ))}
        </div>
      </div>
    </div>
  )
}
