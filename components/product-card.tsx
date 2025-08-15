import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  categoryName: string
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
          <img
            src={product.imageUrl || "/placeholder.svg?height=200&width=300&query=computer component"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {categoryName}
          </Badge>
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
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
          <Button className="flex-1" disabled={!product.inStock}>
            {product.inStock ? "Consultar" : "Fora de Estoque"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
