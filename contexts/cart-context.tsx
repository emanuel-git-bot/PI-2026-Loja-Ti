"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Cart, CartItem, CartContextType, Product, Coupon } from "@/types"

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "techstore-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  })
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Calcular totais
  const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { total, itemCount }
  }

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.productId === product.id)

      let newItems: CartItem[]
      if (existingItem) {
        // Atualizar quantidade do item existente
        newItems = prevCart.items.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        // Adicionar novo item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          addedAt: new Date(),
        }
        newItems = [...prevCart.items, newItem]
      }

      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.productId !== productId)
      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 })
  }

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.productId === productId)
  }

  const getCartItem = (productId: string) => {
    return cart.items.find((item) => item.productId === productId)
  }

  const calculateDiscount = (total: number, coupon: Coupon | null) => {
    if (!coupon) return 0
    if (coupon.discountType === "percentage") {
      return (total * coupon.discountValue) / 100
    }
    return coupon.discountValue
  }

  const discount = calculateDiscount(cart.total, appliedCoupon)
  const finalPrice = Math.max(0, cart.total - discount)

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartItem,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        totalPrice: cart.total,
        discount,
        finalPrice,
        items: cart.items,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
