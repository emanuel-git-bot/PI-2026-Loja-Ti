"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useCoupons } from "@/hooks/use-coupons"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, X } from "lucide-react"
import { toast } from "sonner"

export default function CarrinhoPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    totalPrice,
    discount,
    finalPrice,
  } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const { validateCoupon } = useCoupons()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    // setIsCheckingOut(true)
    // Simular processo de checkout
    // setTimeout(() => {
    //   alert("Pedido realizado com sucesso! Entraremos em contato em breve.")
    //   clearCart()
    //   setIsCheckingOut(false)
    // }, 2000)
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Digite um código de cupom")
      return
    }

    const coupon = validateCoupon(couponCode, totalPrice)
    if (coupon) {
      applyCoupon(coupon)
      toast.success(`Cupom ${coupon.code} aplicado com sucesso!`)
      setCouponCode("")
    } else {
      toast.error("Cupom inválido ou expirado")
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.success("Cupom removido")
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Adicione alguns produtos incríveis ao seu carrinho!</p>
            <Link href="/loja/produtos">
              <Button size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/loja/produtos"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Carrinho de Compras</h1>
          <p className="text-gray-600 dark:text-gray-400">Revise seus itens antes de finalizar o pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.imageUrls[0] || "/computer-component.jpg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.product.barcode && `Código: ${item.product.barcode}`}
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                        R$ {(item.product.price ?? 0).toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        R$ {((item.product.price ?? 0) * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-2"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cupom de Desconto</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button onClick={handleApplyCoupon} variant="outline">
                        Aplicar
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>
                    Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"})
                  </span>
                  <span>R$ {(totalPrice ?? 0).toFixed(2).replace(".", ",")}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Desconto ({appliedCoupon.code})</span>
                    <span>- R$ {(discount ?? 0).toFixed(2).replace(".", ",")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-600 dark:text-green-400">Grátis</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {(finalPrice ?? 0).toFixed(2).replace(".", ",")}</span>
                </div>

                <Link href="/loja/checkout">
                  <Button className="w-full" size="lg">
                    Ir para Pagamento
                  </Button>
                </Link>

                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  Limpar Carrinho
                </Button>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  <p>🔒 Compra segura e protegida</p>
                  <p>📞 Suporte: (11) 9999-9999</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
