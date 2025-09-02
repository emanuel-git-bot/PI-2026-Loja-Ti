"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Product, Category } from "@/types"

export function useApiProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar produtos da API
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getProdutos()
      setProducts(response.data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar produtos")
      console.error("Erro ao carregar produtos:", err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar categorias da API
  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getCategorias()
      setCategories(response.data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar categorias")
      console.error("Erro ao carregar categorias:", err)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar produto
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createProduto(product)
      await loadProducts() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar produto")
      console.error("Erro ao adicionar produto:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar produto
  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateProduto(id, product)
      await loadProducts() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar produto")
      console.error("Erro ao atualizar produto:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Remover produto
  const removeProduct = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteProduto(id)
      await loadProducts() // Recarregar lista
    } catch (err: any) {
      setError(err.message || "Erro ao remover produto")
      console.error("Erro ao remover produto:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Adicionar categoria
  const addCategory = async (category: Omit<Category, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createCategoria(category)
      await loadCategories() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar categoria")
      console.error("Erro ao adicionar categoria:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar categoria
  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateCategoria(id, category)
      await loadCategories() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar categoria")
      console.error("Erro ao atualizar categoria:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Remover categoria
  const removeCategory = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteCategoria(id)
      await loadCategories() // Recarregar lista
    } catch (err: any) {
      setError(err.message || "Erro ao remover categoria")
      console.error("Erro ao remover categoria:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Filtrar produtos por categoria
  const getProductsByCategory = (categoryId: string) => {
    return products.filter((product) => product.categoryId === categoryId)
  }

  // Buscar produtos
  const searchProducts = (query: string) => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    addCategory,
    updateCategory,
    removeCategory,
    getProductsByCategory,
    searchProducts,
    loadProducts,
    loadCategories,
  }
}
