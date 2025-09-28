"use client"

import { useState, useEffect } from "react"
import type { Deal } from "@/types"

// Mock data - em produção viria de uma API
const MOCK_DEALS: Deal[] = [
  {
    id: "1",
    productId: "1",
    discountPercentage: 25,
    originalPrice: 1200,
    discountedPrice: 900,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    productId: "2",
    discountPercentage: 15,
    originalPrice: 2500,
    discountedPrice: 2125,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setDeals(MOCK_DEALS)
      setIsLoading(false)
    }, 500)
  }, [])

  const createDeal = async (dealData: Omit<Deal, "id" | "createdAt" | "updatedAt">) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setDeals((prev) => [...prev, newDeal])
    return newDeal
  }

  const updateDeal = async (id: string, dealData: Partial<Deal>) => {
    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, ...dealData, updatedAt: new Date() } : deal)))
  }

  const deleteDeal = async (id: string) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id))
  }

  const toggleDealStatus = async (id: string) => {
    setDeals((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, isActive: !deal.isActive, updatedAt: new Date() } : deal)),
    )
  }

  return {
    deals,
    isLoading,
    createDeal,
    updateDeal,
    deleteDeal,
    toggleDealStatus,
  }
}
