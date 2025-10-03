"use client"

import { useOrders } from "@/hooks/use-orders"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Clock, CheckCircle2, XCircle, Truck, MapPin, CreditCard, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    color: "bg-yellow-500",
    description: "Aguardando confirmação de pagamento",
  },
  processing: { label: "Processando", icon: Package, color: "bg-blue-500", description: "Pedido em preparação" },
  shipped: { label: "Enviado", icon: Truck, color: "bg-purple-500", description: "Pedido a caminho" },
  delivered: { label: "Entregue", icon: CheckCircle2, color: "bg-success", description: "Pedido entregue com sucesso" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-destructive", description: "Pedido cancelado" },
}

const paymentMethodLabels = {
  credit_card: "Cartão de Crédito",
  pix: "PIX",
  boleto: "Boleto Bancário",
}

export default function DetalhePedidoPage() {
  const params = useParams()
  const id = params.id as string
  const { orders } = useOrders()
  const { user } = useAuth()
  const router = useRouter()

  const order = orders.find((o) => o.id === id)

  if (!user) {
    router.push("/login")
    return null
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
          <Link href="/loja/pedidos">
            <Button>Ver Meus Pedidos</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.status].icon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/loja/pedidos">
          <Button variant="ghost">← Voltar para Meus Pedidos</Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status do Pedido */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
                <p className="text-sm text-muted-foreground">
                  Realizado em{" "}
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge className={`${statusConfig[order.status].color} text-white`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusConfig[order.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{statusConfig[order.status].description}</p>

            {/* Timeline de Status */}
            <div className="mt-6 space-y-4">
              {Object.entries(statusConfig).map(([key, config]) => {
                const Icon = config.icon
                const isCompleted =
                  ["pending", "processing", "shipped", "delivered"].indexOf(key) <=
                  ["pending", "processing", "shipped", "delivered"].indexOf(order.status)
                const isCurrent = key === order.status

                return (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? config.color : "bg-muted"
                      } ${isCurrent ? "ring-4 ring-offset-2 ring-offset-background" : ""}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? "" : "text-muted-foreground"}`}>{config.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Produtos */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Produtos</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                    <p className="font-semibold mt-1">R$ {((item.price ?? 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Resumo do Pagamento */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pagamento
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método</span>
                <span>{paymentMethodLabels[order.paymentMethod]}</span>
              </div>
              {order.couponCode && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-success text-sm">
                    <Tag className="h-4 w-4" />
                    <span>Cupom: {order.couponCode}</span>
                  </div>
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto</span>
                    <span>- R$ {(order.discount ?? 0).toFixed(2)}</span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {(order.totalAmount ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Endereço de Entrega */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Entrega
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.customerInfo.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city} - {order.shippingAddress.state}
              </p>
              <p className="text-muted-foreground">CEP: {order.shippingAddress.zipCode}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
