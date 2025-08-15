"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/use-products"
import { ArrowLeft, ShoppingCart, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const { products, categories } = useProducts()
  const { toast } = useToast()

  const product = products.find((p) => p.id === params.id)
  const category = product ? categories.find((c) => c.id === product.categoryId) : null

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

  const handleConsultPrice = () => {
    toast({
      title: "Consulta enviada!",
      description: "Entraremos em contato em breve com informações sobre este produto.",
    })
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
              <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
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
    <div className="bg-gray-50 min-h-screen">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={product.imageUrl || "/placeholder.svg?height=500&width=500&query=computer component"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {category?.name}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            <div className="text-4xl font-bold text-green-600">R$ {product.price.toFixed(2).replace(".", ",")}</div>

            <div className="flex items-center space-x-4">
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "Em Estoque" : "Fora de Estoque"}
              </Badge>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="w-full" disabled={!product.inStock} onClick={handleConsultPrice}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Consultar Preço" : "Produto Indisponível"}
              </Button>
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
                      <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
