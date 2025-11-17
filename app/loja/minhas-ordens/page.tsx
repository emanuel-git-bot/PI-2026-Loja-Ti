"use client"

import { useAuth } from "@/contexts/auth-context"
import { useServiceOrders } from "@/hooks/use-service-orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, AlertCircle, Printer } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const statusConfig = {
  requested: { label: "Solicitado", color: "bg-blue-500", icon: Clock },
  analyzing: { label: "Em Análise", color: "bg-yellow-500", icon: AlertCircle },
  approved: { label: "Aprovado", color: "bg-green-500", icon: CheckCircle },
  in_progress: { label: "Em Andamento", color: "bg-purple-500", icon: Clock },
  completed: { label: "Concluído", color: "bg-green-600", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500", icon: XCircle },
}

const priorityConfig = {
  low: { label: "Baixa", color: "bg-gray-500" },
  medium: { label: "Média", color: "bg-yellow-500" },
  high: { label: "Alta", color: "bg-red-500" },
}

export default function MinhasOrdensPage() {
  const { user } = useAuth()
  const { getOrdersByUser } = useServiceOrders()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const handlePrint = (orderId: string) => {
    const printContent = document.getElementById(`order-${orderId}`)
    if (!printContent) return

    const printWindow = window.open("", "", "width=800,height=600")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Ordem de Serviço - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1f2937; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 4px; margin: 5px 0; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (!user) return null

  const myOrders = getOrdersByUser(user.email)

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Minhas Ordens de Serviço</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe o status das suas solicitações de serviço</p>
        </div>

        <div className="space-y-4">
          {myOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <Card key={order.id} className="dark:bg-gray-800 dark:border-gray-700">
                <div id={`order-${order.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl dark:text-white">{order.service.name}</CardTitle>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(order.id)}
                          className="print:hidden"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                        <Badge className={`${statusConfig[order.status].color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                        <Badge className={`${priorityConfig[order.priority].color} text-white`}>
                          {priorityConfig[order.priority].label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">ID da Ordem:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{order.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Data da Solicitação:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
                          Status do Serviço:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {Object.entries(statusConfig).map(([key, config]) => {
                            const Icon = config.icon
                            const isActive = key === order.status
                            const statusIndex = Object.keys(statusConfig).indexOf(key)
                            const currentIndex = Object.keys(statusConfig).indexOf(order.status)
                            const isPassed = statusIndex < currentIndex

                            return (
                              <div
                                key={key}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                  isActive
                                    ? `${config.color} text-white font-semibold`
                                    : isPassed
                                      ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                <Icon className="h-3 w-3" />
                                <span>{config.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Descrição:</span>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{order.description}</p>
                      </div>
                      {order.adminNotes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <span className="font-medium text-blue-900 dark:text-blue-300">Atualização do Admin:</span>
                          <p className="mt-1 text-blue-800 dark:text-blue-400">{order.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}

          {myOrders.length === 0 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Você ainda não tem ordens de serviço.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
