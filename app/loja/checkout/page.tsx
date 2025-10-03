"use client"

import type React from "react"

import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Barcode, CheckCircle2, Tag } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useOrders } from "@/hooks/use-orders"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, totalPrice, appliedCoupon, discount, finalPrice, clearCart, removeCoupon } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { createOrder } = useOrders()

  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix" | "boleto">("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  })

  if (items.length === 0 && !paymentSuccess) {
    router.push("/loja/carrinho")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simular processamento de pagamento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const order = createOrder({
      userId: user?.id || "guest",
      userName: formData.name,
      userEmail: formData.email,
      items: items, // Passar os items do carrinho diretamente, que já têm o formato correto
      subtotal: totalPrice,
      discount: discount,
      couponCode: appliedCoupon?.code,
      total: finalPrice,
      status: "pending",
      paymentMethod: "mercadopago",
      paymentStatus: "approved",
      shippingAddress: {
        street: formData.address,
        number: "S/N", // Adicionar número padrão
        complement: "",
        neighborhood: "Centro", // Adicionar bairro padrão
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
    })

    setIsProcessing(false)
    setPaymentSuccess(true)
    clearCart()
    removeCoupon()

    toast.success("Pagamento realizado com sucesso!")

    setTimeout(() => {
      router.push(`/loja/pedidos/${order.id}`)
    }, 3000)
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pagamento Aprovado!</h1>
          <p className="text-muted-foreground mb-6">Seu pedido foi confirmado e está sendo processado.</p>
          <p className="text-sm text-muted-foreground">Você será redirecionado para acompanhar seu pedido...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Pessoais */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Endereço de Entrega */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="00000-000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="UF"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Forma de Pagamento */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" />
                    <span>Cartão de Crédito</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5" />
                    <span>PIX</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="boleto" id="boleto" />
                  <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Barcode className="h-5 w-5" />
                    <span>Boleto Bancário</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {paymentMethod === "credit_card" && (
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Nome no Cartão</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Como está no cartão"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      name="cardCvv"
                      type="password"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="000"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "pix" && (
              <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Após confirmar o pedido, você receberá o QR Code para pagamento via PIX
                </p>
              </div>
            )}

            {paymentMethod === "boleto" && (
              <div className="mt-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">O boleto será gerado após a confirmação do pedido</p>
              </div>
            )}
          </Card>
        </div>

        {/* Resumo do Pedido */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.product.imageUrls[0] && (
                      <Image
                        src={item.product.imageUrls[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {appliedCoupon && (
              <div className="mb-4 p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2 text-success text-sm">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">{appliedCoupon.code}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-success">
                  <span>Desconto</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-success">Grátis</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processando..." : "Confirmar Pagamento"}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Pagamento seguro processado pelo Mercado Pago
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
