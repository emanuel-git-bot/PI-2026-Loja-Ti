"use client"

import { useState, useEffect } from "react"
import type { Coupon } from "@/types"

const COUPONS_STORAGE_KEY = "techstore-coupons"

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = () => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setCoupons(
          parsed.map((c: any) => ({
            ...c,
            startDate: new Date(c.startDate),
            endDate: new Date(c.endDate),
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
          })),
        )
      } else {
        // Cupons de exemplo
        const defaultCoupons: Coupon[] = [
          {
            id: "1",
            code: "BEMVINDO10",
            description: "10% de desconto para novos clientes",
            discountType: "percentage",
            discountValue: 10,
            minPurchaseAmount: 100,
            maxDiscountAmount: 50,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            usageLimit: 100,
            usageCount: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
        setCoupons(defaultCoupons)
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(defaultCoupons))
      }
    } catch (error) {
      console.error("Erro ao carregar cupons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons)
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(newCoupons))
  }

  const addCoupon = (coupon: Omit<Coupon, "id" | "createdAt" | "updatedAt" | "usageCount">) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveCoupons([...coupons, newCoupon])
    return newCoupon
  }

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c))
    saveCoupons(updated)
  }

  const deleteCoupon = (id: string) => {
    saveCoupons(coupons.filter((c) => c.id !== id))
  }

  const validateCoupon = (code: string, cartTotal: number): { valid: boolean; message: string; coupon?: Coupon } => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase())

    if (!coupon) {
      return { valid: false, message: "Cupom não encontrado" }
    }

    if (!coupon.isActive) {
      return { valid: false, message: "Cupom inativo" }
    }

    const now = new Date()
    if (now < coupon.startDate) {
      return { valid: false, message: "Cupom ainda não está válido" }
    }

    if (now > coupon.endDate) {
      return { valid: false, message: "Cupom expirado" }
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: "Cupom esgotado" }
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return {
        valid: false,
        message: `Valor mínimo de compra: R$ ${coupon.minPurchaseAmount.toFixed(2)}`,
      }
    }

    return { valid: true, message: "Cupom válido", coupon }
  }

  const applyCoupon = (coupon: Coupon, cartTotal: number): number => {
    let discount = 0

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount
      }
    } else {
      discount = coupon.discountValue
    }

    return Math.min(discount, cartTotal)
  }

  const incrementUsage = (id: string) => {
    updateCoupon(id, { usageCount: (coupons.find((c) => c.id === id)?.usageCount || 0) + 1 })
  }

  return {
    coupons,
    isLoading,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    applyCoupon,
    incrementUsage,
  }
}
