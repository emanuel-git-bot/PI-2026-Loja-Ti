"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/use-products"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { ArrowLeft, Share2, ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProductGallery } from "@/components/product-gallery"
import { ReviewsSection } from "@/components/reviews-section"
import { RelatedProducts } from "@/components/related-products"
import { StarRating } from "@/components/star-rating"
import { useReviews } from "@/hooks/use-reviews"

export default function ProductDetailPage() {
  const params = useParams()
  const { products, categories } = useProducts()
  const { addToCart, isInCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { getReviewStats } = useReviews()
  const { toast } = useToast()

  const product = products.find((p) => p.id === params.id)
  const category = product ? categories.find((c) => c.id === product.categoryId) : null
  const reviewStats = product ? getReviewStats(product.id) : null

  const images = product?.imageUrls?.length > 0 ? product.imageUrls : ["/computer-component.jpg"]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado!",
        description: "O link do produto foi copiado para a área de transferência.",
      })
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      })
    }
  }

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id)
        toast({
          title: "Removido dos favoritos",
          description: `${product.name} foi removido dos seus favoritos.`,
        })
      } else {
        addToFavorites(product)
        toast({
          title: "Adicionado aos favoritos",
          description: `${product.name} foi adicionado aos seus favoritos.`,
        })
      }
    }
  }

  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold dark:text-white mb-4">Produto não encontrado</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                O produto que você está procurando não existe ou foi removido.
              </p>
              <Link href="/loja/produtos">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Produtos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/loja/produtos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Produtos
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductGallery images={images} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {category?.name}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
              {product.barcode && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Código: {product.barcode}</p>
              )}

              {reviewStats && reviewStats.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={reviewStats.averageRating} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({reviewStats.totalReviews} avaliação{reviewStats.totalReviews !== 1 ? "ões" : ""})
                  </span>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 text-lg">{product.description}</p>
            </div>

            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "Em Estoque" : "Fora de Estoque"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button size="lg" className="flex-1" disabled={!product.inStock} onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(product.id) ? "Já no Carrinho" : "Adicionar ao Carrinho"}
                </Button>
                <Button size="lg" variant="outline" onClick={handleToggleFavorite}>
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              <Link href="/loja/contato">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Solicitar Orçamento
                </Button>
              </Link>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mb-12">
          <ReviewsSection productId={product.id} />
        </div>

        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  )
}
