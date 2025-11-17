"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { useServiceOrders } from "@/hooks/use-service-orders"
import type { ServiceOrder } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

export default function ServiceOrdersPage() {
  const { orders, updateStatus, deleteOrder } = useServiceOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editStatus, setEditStatus] = useState<ServiceOrder["status"]>("requested")
  const [adminNotes, setAdminNotes] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [finalCost, setFinalCost] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleEditOrder = (order: ServiceOrder) => {
    setSelectedOrder(order)
    setEditStatus(order.status)
    setAdminNotes(order.adminNotes || "")
    setEstimatedCost(order.estimatedCost?.toString() || "")
    setFinalCost(order.finalCost?.toString() || "")
    setIsEditDialogOpen(true)
  }

  const handleSaveChanges = () => {
    if (!selectedOrder) return

    updateStatus(selectedOrder.id, editStatus, adminNotes)

    if (estimatedCost) {
      updateStatus(selectedOrder.id, editStatus, adminNotes)
    }

    toast.success("Ordem de serviço atualizada com sucesso!")
    setIsEditDialogOpen(false)
  }

  const handleDeleteOrder = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta ordem de serviço?")) {
      deleteOrder(id)
      toast.success("Ordem de serviço excluída com sucesso!")
    }
  }

  const stats = {
    total: orders.length,
    requested: orders.filter((o) => o.status === "requested").length,
    inProgress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Admin" }, { label: "Ordens de Serviço" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as solicitações de serviço</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total de Ordens</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.requested}</div>
            <p className="text-sm text-gray-600">Solicitadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-sm text-gray-600">Concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, email, serviço ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="requested">Solicitado</SelectItem>
                <SelectItem value="analyzing">Em Análise</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon
              return (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{order.service.name}</h3>
                        <Badge className={`${statusConfig[order.status].color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                        <Badge className={`${priorityConfig[order.priority].color} text-white`}>
                          {priorityConfig[order.priority].label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Cliente:</span> {order.userName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {order.userEmail}
                        </div>
                        <div>
                          <span className="font-medium">ID:</span> {order.id}
                        </div>
                        <div>
                          <span className="font-medium">Data:</span>{" "}
                          {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{order.description}</p>
                      {order.adminNotes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notas do Admin:</span> {order.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">Nenhuma ordem de serviço encontrada.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço</DialogTitle>
            <DialogDescription>Atualize o status e adicione notas sobre a ordem de serviço</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={(value) => setEditStatus(value as ServiceOrder["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requested">Solicitado</SelectItem>
                    <SelectItem value="analyzing">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notas do Administrador</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Adicione notas sobre o andamento do serviço..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveChanges} className="flex-1">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
