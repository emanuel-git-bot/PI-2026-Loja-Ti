"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useServices } from "@/hooks/use-services"
import { useToast } from "@/hooks/use-toast"
import type { Service } from "@/types"

interface ServiceFormProps {
  service?: Service
  onSuccess?: () => void
  onCancel?: () => void
}

export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { addService, updateService } = useServices()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || 0,
    duration: service?.duration || "",
    available: service?.available ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.duration) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (formData.price <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser maior que zero.",
        variant: "destructive",
      })
      return
    }

    if (service) {
      updateService(service.id, formData)
      toast({
        title: "Serviço atualizado!",
        description: "As alterações foram salvas com sucesso.",
      })
    } else {
      addService(formData)
      toast({
        title: "Serviço adicionado!",
        description: "O serviço foi cadastrado com sucesso.",
      })
    }

    onSuccess?.()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{service ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Montagem de PC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração Estimada *</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="Ex: 2-3 horas, 1 dia útil, 30 minutos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Serviço *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva detalhadamente o que está incluído no serviço..."
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))}
            />
            <Label htmlFor="available">Serviço disponível para contratação</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {service ? "Atualizar Serviço" : "Cadastrar Serviço"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
