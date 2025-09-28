"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"

interface ProductCardProps {
  product: Product
  categoryName: string
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart, isInCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const images = product.imageUrls?.length > 0 ? product.imageUrls : ["/computer-component.jpg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-3 relative group">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isFavorite(product.id)
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {categoryName}
          </Badge>
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          {product.barcode && <p className="text-xs text-gray-500">Código: {product.barcode}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2).replace(".", ",")}</div>

        {Object.keys(product.specifications).length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Especificações:</p>
            <div className="text-xs text-gray-600 space-y-1">
              {Object.entries(product.specifications)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/loja/produtos/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Ver Detalhes
            </Button>
          </Link>
          <Button onClick={handleAddToCart} className="flex-1" disabled={!product.inStock || isInCart(product.id)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {!product.inStock ? "Fora de Estoque" : isInCart(product.id) ? "No Carrinho" : "Adicionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
