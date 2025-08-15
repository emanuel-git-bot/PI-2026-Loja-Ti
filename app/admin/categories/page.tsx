"use client"

import { CategoriesList } from "@/components/categories-list"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CategoriesPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Categorias" }]} />
      <CategoriesList />
    </div>
  )
}
