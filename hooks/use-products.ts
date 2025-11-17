"use client"
import type { Product, Category } from "@/types"
import { useLocalStorage } from "./use-local-storage"

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Processadores",
    description: "CPUs Intel e AMD",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Placas de Vídeo",
    description: "GPUs NVIDIA e AMD",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Memória RAM",
    description: "Memórias DDR4 e DDR5",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Armazenamento",
    description: "SSDs e HDDs",
    createdAt: new Date(),
  },
]

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Intel Core i7-13700K",
    description: "Processador Intel Core i7 13ª geração",
    price: 2299.99,
    categoryId: "1",
    imageUrls: ["/intel-processor.png"],
    barcode: "7891234567890",
    inStock: true,
    specifications: {
      Núcleos: "16",
      Threads: "24",
      "Frequência Base": "3.4 GHz",
      "Frequência Turbo": "5.4 GHz",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: false,
  },
  {
    id: "2",
    name: "NVIDIA RTX 4070",
    description: "Placa de vídeo NVIDIA GeForce RTX 4070",
    price: 3499.99,
    categoryId: "2",
    imageUrls: ["/nvidia-rtx-graphics-card.png"],
    barcode: "7891234567891",
    inStock: true,
    specifications: {
      Memória: "12GB GDDR6X",
      "CUDA Cores": "5888",
      "Frequência Base": "1920 MHz",
      "Frequência Boost": "2475 MHz",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: false,
  },
]

export function useProducts() {
  const [products, setProducts] = useLocalStorage<Product[]>("products", INITIAL_PRODUCTS)
  const [categories, setCategories] = useLocalStorage<Category[]>("categories", INITIAL_CATEGORIES)

  const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      featured: false,
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...updates, updatedAt: new Date() } : product)),
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, featured: !product.featured, updatedAt: new Date() } : product,
      ),
    )
  }

  const addCategory = (category: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, ...updates } : category)))
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id))
    // Remove produtos da categoria deletada
    setProducts((prev) => prev.filter((product) => product.categoryId !== id))
  }

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
