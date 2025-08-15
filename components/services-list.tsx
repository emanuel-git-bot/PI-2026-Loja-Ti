"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServices } from "@/hooks/use-services"
import { useToast } from "@/hooks/use-toast"
import { ServiceForm } from "./service-form"
import { Edit, Trash2, Plus, Search, Clock, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function ServicesList() {
  const { services, deleteService } = useServices()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteService = (serviceId: string) => {
    deleteService(serviceId)
    toast({
      title: "Serviço excluído!",
      description: "O serviço foi removido com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Serviço</DialogTitle>
              <DialogDescription>Preencha as informações do serviço abaixo.</DialogDescription>
            </DialogHeader>
            <ServiceForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant={service.available ? "default" : "secondary"}>
                  {service.available ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-xl font-bold">R$ {service.price.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Criado em: {new Date(service.createdAt).toLocaleDateString("pt-BR")}
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Editar Serviço</DialogTitle>
                      <DialogDescription>Faça as alterações necessárias no serviço.</DialogDescription>
                    </DialogHeader>
                    <ServiceForm service={service} />
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o serviço "{service.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteService(service.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? "Nenhum serviço encontrado para sua busca." : "Nenhum serviço encontrado."}
            </p>
            <Button className="mt-4" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {searchTerm ? "Limpar busca" : "Adicionar primeiro serviço"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
