"use client"

import { ProductCard } from "./product-card"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/types"

interface RelatedProductsProps {
  currentProduct: Product
  maxProducts?: number
}

export function RelatedProducts({ currentProduct, maxProducts = 4 }: RelatedProductsProps) {
  const { products } = useProducts()

  // Buscar produtos relacionados da mesma categoria, excluindo o produto atual
  const relatedProducts = products
    .filter(
      (product) =>
        product.categoryId === currentProduct.categoryId && product.id !== currentProduct.id && product.inStock,
    )
    .slice(0, maxProducts)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
