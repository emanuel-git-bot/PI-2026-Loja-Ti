"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types"

interface CategoryFormProps {
  category?: Category
  onSuccess?: () => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { addCategory, updateCategory } = useProducts()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    if (category) {
      updateCategory(category.id, formData)
      toast({
        title: "Categoria atualizada!",
        description: "As alterações foram salvas com sucesso.",
      })
    } else {
      addCategory(formData)
      toast({
        title: "Categoria adicionada!",
        description: "A categoria foi cadastrada com sucesso.",
      })
    }

    onSuccess?.()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{category ? "Editar Categoria" : "Nova Categoria"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Processadores"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva a categoria..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {category ? "Atualizar Categoria" : "Cadastrar Categoria"}
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
