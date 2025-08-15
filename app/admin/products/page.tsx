"use client"

import { ProductsList } from "@/components/products-list"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ProductsPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Produtos" }]} />
      <ProductsList />
    </div>
  )
}
