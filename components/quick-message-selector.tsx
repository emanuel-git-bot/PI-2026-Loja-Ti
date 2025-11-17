"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Package, Wrench, Tag, Ticket } from "lucide-react"
import { useOrders } from "@/hooks/use-orders"
import { useDeals } from "@/hooks/use-deals"
import { useCoupons } from "@/hooks/use-coupons"
import type { ChatMessage } from "@/types"

interface QuickMessageSelectorProps {
  onSendSpecialMessage: (message: string, messageType: ChatMessage["messageType"], additionalData?: any) => void
}

export function QuickMessageSelector({ onSendSpecialMessage }: QuickMessageSelectorProps) {
  const [dialogType, setDialogType] = useState<"order" | "service" | "deal" | "coupon" | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [selectedDealId, setSelectedDealId] = useState("")
  const [selectedCouponId, setSelectedCouponId] = useState("")
  const [serviceStatus, setServiceStatus] = useState("")

  const { orders } = useOrders()
  const { deals } = useDeals()
  const { coupons } = useCoupons()

  const handleSendOrder = () => {
    const order = orders.find((o) => o.id === selectedOrderId)
    if (!order) return

    onSendSpecialMessage(`Seu pedido ${order.id} foi atualizado para: ${order.status}`, "order", {
      orderData: {
        orderId: order.id,
        status: order.status,
        total: order.total,
      },
    })
    setDialogType(null)
    setSelectedOrderId("")
  }

  const handleSendService = () => {
    onSendSpecialMessage(`Status do serviço atualizado para: ${serviceStatus}`, "service", {
      serviceData: {
        serviceId: "SRV-001",
        serviceName: "Manutenção de Computador",
        status: serviceStatus,
      },
    })
    setDialogType(null)
    setServiceStatus("")
  }

  const handleSendDeal = () => {
    const deal = deals.find((d) => d.id === selectedDealId)
    if (!deal || !deal.product) return

    onSendSpecialMessage(
      `Confira esta oferta especial! ${deal.discountPercentage}% de desconto em ${deal.product.name}`,
      "deal",
      {
        dealData: {
          dealId: deal.id,
          productName: deal.product.name,
          discountPercentage: deal.discountPercentage,
          originalPrice: deal.originalPrice,
          discountedPrice: deal.discountedPrice,
        },
      },
    )
    setDialogType(null)
    setSelectedDealId("")
  }

  const handleSendCoupon = () => {
    const coupon = coupons.find((c) => c.id === selectedCouponId)
    if (!coupon) return

    onSendSpecialMessage(
      `Cupom especial para você! Use o código ${coupon.code} e ganhe desconto na sua próxima compra.`,
      "coupon",
      {
        couponData: {
          couponId: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          expiresAt: coupon.endDate,
        },
      },
    )
    setDialogType(null)
    setSelectedCouponId("")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Zap className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mensagens Rápidas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogType("order")}>
            <Package className="mr-2 h-4 w-4" />
            Status do Pedido
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogType("service")}>
            <Wrench className="mr-2 h-4 w-4" />
            Status do Serviço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogType("deal")}>
            <Tag className="mr-2 h-4 w-4" />
            Enviar Oferta
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogType("coupon")}>
            <Ticket className="mr-2 h-4 w-4" />
            Enviar Cupom
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para Status do Pedido */}
      <Dialog open={dialogType === "order"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Status do Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione o Pedido</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um pedido" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendOrder} disabled={!selectedOrderId} className="w-full">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Status do Serviço */}
      <Dialog open={dialogType === "service"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Status do Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status do Serviço</Label>
              <Select value={serviceStatus} onValueChange={setServiceStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendService} disabled={!serviceStatus} className="w-full">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Oferta */}
      <Dialog open={dialogType === "deal"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Oferta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione a Oferta</Label>
              <Select value={selectedDealId} onValueChange={setSelectedDealId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma oferta" />
                </SelectTrigger>
                <SelectContent>
                  {deals
                    .filter((deal) => deal.isActive)
                    .map((deal) => (
                      <SelectItem key={deal.id} value={deal.id}>
                        {deal.product?.name} - {deal.discountPercentage}% OFF
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendDeal} disabled={!selectedDealId} className="w-full">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Cupom */}
      <Dialog open={dialogType === "coupon"} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Cupom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione o Cupom</Label>
              <Select value={selectedCouponId} onValueChange={setSelectedCouponId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um cupom" />
                </SelectTrigger>
                <SelectContent>
                  {coupons
                    .filter((coupon) => coupon.isActive)
                    .map((coupon) => (
                      <SelectItem key={coupon.id} value={coupon.id}>
                        {coupon.code} - {coupon.description}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendCoupon} disabled={!selectedCouponId} className="w-full">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
