"use client"

import type { ChatMessage } from "@/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Package, Wrench, Tag, Ticket } from "lucide-react"
import Link from "next/link"

interface ChatBubbleProps {
  message: ChatMessage
  isOwn: boolean
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const renderMessageContent = () => {
    switch (message.messageType) {
      case "order":
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Atualização de Pedido</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message.message}</p>
            {message.orderData && (
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Pedido:</span> {message.orderData.orderId}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{message.orderData.status}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Total:</span> R$ {message.orderData.total.toFixed(2)}
                </p>
              </div>
            )}
            <Link href={`/loja/pedidos/${message.orderData?.orderId}`}>
              <Button size="sm" className="w-full mt-3">
                Ver Pedido
              </Button>
            </Link>
          </div>
        )

      case "service":
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Atualização de Serviço</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message.message}</p>
            {message.serviceData && (
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Serviço:</span> {message.serviceData.serviceName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{message.serviceData.status}</span>
                </p>
              </div>
            )}
          </div>
        )

      case "deal":
        return (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 shadow-sm border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-gray-900">Oferta Especial!</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message.message}</p>
            {message.dealData && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{message.dealData.productName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-orange-600">
                    R$ {message.dealData.discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    R$ {message.dealData.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{message.dealData.discountPercentage}%
                  </span>
                </div>
              </div>
            )}
            <Button size="sm" className="w-full mt-3 bg-orange-600 hover:bg-orange-700">
              Ver Oferta
            </Button>
          </div>
        )

      case "coupon":
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-sm border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Cupom de Desconto!</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{message.message}</p>
            {message.couponData && (
              <div className="space-y-2">
                <div className="bg-white border-2 border-dashed border-purple-300 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Código do cupom</p>
                  <p className="text-2xl font-bold text-purple-600 tracking-wider">{message.couponData.code}</p>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Desconto:</span>{" "}
                    {message.couponData.discountType === "percentage"
                      ? `${message.couponData.discountValue}%`
                      : `R$ ${message.couponData.discountValue.toFixed(2)}`}
                  </p>
                  <p>
                    <span className="font-medium">Válido até:</span>{" "}
                    {format(new Date(message.couponData.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}
            <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
              Usar Cupom
            </Button>
          </div>
        )

      default:
        return (
          <>
            {message.imageUrl && (
              <div className="mb-2">
                <Image
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="Imagem anexada"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
          </>
        )
    }
  }

  return (
    <div className={cn("flex mb-4", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] space-y-1", isOwn ? "items-end" : "items-start")}>
        {!isOwn && <p className="text-xs text-gray-500 px-3">{message.senderName}</p>}

        <div
          className={cn(
            "rounded-2xl shadow-sm",
            message.messageType === "text"
              ? cn(
                  "px-4 py-2",
                  isOwn ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none",
                )
              : "",
          )}
        >
          {renderMessageContent()}
        </div>

        <p className={cn("text-xs px-3", isOwn ? "text-gray-400" : "text-gray-500")}>
          {format(new Date(message.createdAt), "HH:mm", { locale: ptBR })}
        </p>
      </div>
    </div>
  )
}
