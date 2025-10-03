"use client"

import { useOrders } from "@/hooks/use-orders"
import { useAuth } from "@/contexts/auth-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle2, XCircle, Truck, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

const statusConfig = {
  pending: { label: "Pendente", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processando", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Enviado", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Entregue", icon: CheckCircle2, color: "bg-success" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "bg-destructive" },
}

export default function MeusPedidosPage() {
  const { orders } = useOrders()
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  // Filtrar pedidos do usuário (em produção, isso viria da API)
  const userOrders = orders.filter((order) => order.customerInfo.email === user.email)

  if (userOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhum pedido encontrado</h2>
          <p className="text-muted-foreground mb-6">Você ainda não realizou nenhuma compra.</p>
          <Link href="/loja">
            <Button>Começar a Comprar</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

      <div className="space-y-4">
        {userOrders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon

          return (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge className={`${statusConfig[order.status].color} text-white`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {statusConfig[order.status].label}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity} • R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">R$ {order.totalAmount.toFixed(2)}</p>
                </div>
                <Link href={`/loja/pedidos/${order.id}`}>
                  <Button variant="outline">Ver Detalhes</Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
