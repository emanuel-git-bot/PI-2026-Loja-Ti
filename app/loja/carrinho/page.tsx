"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"

export default function CarrinhoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simular processo de checkout
    setTimeout(() => {
      alert("Pedido realizado com sucesso! Entraremos em contato em breve.")
      clearCart()
      setIsCheckingOut(false)
    }, 2000)
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-8">Adicione alguns produtos incríveis ao seu carrinho!</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/loja/produtos" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Carrinho de Compras</h1>
          <p className="text-gray-600">Revise seus itens antes de finalizar o pedido</p>
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
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.barcode && `Código: ${item.product.barcode}`}
                      </p>
                      <p className="text-lg font-bold text-green-600 mt-2">
                        R$ {item.product.price.toFixed(2).replace(".", ",")}
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
                      <p className="text-lg font-bold text-gray-900">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-700 mt-2"
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
                <div className="flex justify-between">
                  <span>
                    Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "itens"})
                  </span>
                  <span>R$ {cart.total.toFixed(2).replace(".", ",")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R$ {cart.total.toFixed(2).replace(".", ",")}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processando..." : "Finalizar Pedido"}
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  Limpar Carrinho
                </Button>

                <div className="text-xs text-gray-500 text-center mt-4">
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
