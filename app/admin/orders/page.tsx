"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrders } from "@/hooks/use-orders"
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Eye } from "lucide-react"
import type { Order } from "@/types"

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: ShoppingCart },
  processing: { label: "Processando", color: "bg-blue-100 text-blue-800", icon: Package },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-1">Gerencie todos os pedidos da loja</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Processando</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Enviados</p>
              <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Entregues</p>
              <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filtrar por status:</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum pedido encontrado</p>
            ) : (
              filteredOrders.map((order) => {
                const config = statusConfig[order.status]
                const StatusIcon = config.icon

                return (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                          <Badge className={config.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          {order.paymentStatus === "approved" && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Pago
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {order.userName} • {order.userEmail}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          R$ {(order.total ?? 0).toFixed(2).replace(".", ",")}
                        </p>
                        {(order.discount ?? 0) > 0 && (
                          <p className="text-sm text-green-600">Desconto: R$ {(order.discount ?? 0).toFixed(2)}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Itens do Pedido:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity}x {item.product?.name || "Produto não encontrado"} - R${" "}
                              {((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Endereço de Entrega:</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.street}, {order.shippingAddress.number}
                          {order.shippingAddress.complement && ` - ${order.shippingAddress.complement}`}
                          <br />
                          {order.shippingAddress.neighborhood}, {order.shippingAddress.city} -{" "}
                          {order.shippingAddress.state}
                          <br />
                          CEP: {order.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Select
                        value={order.status}
                        onValueChange={(value: Order["status"]) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="processing">Processando</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
