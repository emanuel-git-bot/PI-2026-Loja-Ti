"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/types"

const ORDERS_STORAGE_KEY = "techstore-orders"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setOrders(
          parsed.map((o: any) => ({
            ...o,
            createdAt: new Date(o.createdAt),
            updatedAt: new Date(o.updatedAt),
            items: o.items.map((item: any) => ({
              ...item,
              addedAt: new Date(item.addedAt),
            })),
          })),
        )
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(newOrders))
  }

  const createOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    saveOrders([newOrder, ...orders])
    return newOrder
  }

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date() } : o))
    saveOrders(updated)
  }

  const updatePaymentStatus = (id: string, paymentStatus: Order["paymentStatus"], paymentId?: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, paymentStatus, paymentId, updatedAt: new Date() } : o))
    saveOrders(updated)
  }

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id)
  }

  const getOrdersByUser = (userEmail: string) => {
    return orders.filter((o) => o.userEmail === userEmail)
  }

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
    getOrdersByUser,
  }
}
