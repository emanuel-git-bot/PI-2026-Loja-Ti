"use client"

import { useState } from "react"
import type { ServiceOrder } from "@/types"
import { useLocalStorage } from "./use-local-storage"

export function useServiceOrders() {
  const [orders, setOrders] = useLocalStorage<ServiceOrder[]>("service-orders", [])
  const [isLoading, setIsLoading] = useState(false)

  const createOrder = (orderData: Omit<ServiceOrder, "id" | "createdAt" | "updatedAt">) => {
    const newOrder: ServiceOrder = {
      ...orderData,
      id: `SO-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setOrders([...orders, newOrder])
    return newOrder
  }

  const updateOrder = (id: string, updates: Partial<ServiceOrder>) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              ...updates,
              updatedAt: new Date(),
            }
          : order,
      ),
    )
  }

  const updateStatus = (id: string, status: ServiceOrder["status"], adminNotes?: string) => {
    updateOrder(id, { status, adminNotes, updatedAt: new Date() })
  }

  const deleteOrder = (id: string) => {
    setOrders(orders.filter((order) => order.id !== id))
  }

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  const getOrdersByUser = (userEmail: string) => {
    return orders.filter((order) => order.userEmail === userEmail)
  }

  const getOrdersByStatus = (status: ServiceOrder["status"]) => {
    return orders.filter((order) => order.status === status)
  }

  return {
    orders,
    isLoading,
    createOrder,
    updateOrder,
    updateStatus,
    deleteOrder,
    getOrderById,
    getOrdersByUser,
    getOrdersByStatus,
  }
}
