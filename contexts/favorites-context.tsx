"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { FavoritesContextType, Product } from "@/types"

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = "techstore-favorites"

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  // Carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        setFavorites(parsedFavorites)
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error)
      }
    }
  }, [])

  // Salvar favoritos no localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product: Product) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.id === product.id)
      if (isAlreadyFavorite) {
        return prevFavorites
      }
      return [...prevFavorites, product]
    })
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.id === productId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
