"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react"
import type { Product } from "@/types"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { categories, addProduct, updateProduct } = useProducts()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    categoryId: product?.categoryId || "",
    imageUrls: product?.imageUrls || [""],
    barcode: product?.barcode || "",
    inStock: product?.inStock ?? true,
    specifications: product?.specifications || {},
  })

  const [specKey, setSpecKey] = useState("")
  const [specValue, setSpecValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.categoryId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const filteredImageUrls = formData.imageUrls.filter((url) => url.trim() !== "")

    const productData = {
      ...formData,
      imageUrls: filteredImageUrls,
    }

    if (product) {
      updateProduct(product.id, productData)
      toast({
        title: "Produto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      })
    } else {
      addProduct(productData)
      toast({
        title: "Produto adicionado!",
        description: "O produto foi cadastrado com sucesso.",
      })
    }

    onSuccess?.()
  }

  const addImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""],
    }))
  }

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))
  }

  const updateImageUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => (i === index ? value : url)),
    }))
  }

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue,
        },
      }))
      setSpecKey("")
      setSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Editar Produto" : "Novo Produto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Intel Core i7-13700K"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="barcode">Código de Barras</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))}
              placeholder="Ex: 7891234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o produto..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>URLs das Imagens</Label>
              <Button type="button" onClick={addImageUrl} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Imagem
              </Button>
            </div>

            <div className="space-y-3">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder={`URL da imagem ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.imageUrls.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inStock: checked }))}
            />
            <Label htmlFor="inStock">Produto em estoque</Label>
          </div>

          <div className="space-y-4">
            <Label>Especificações Técnicas</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input placeholder="Nome da especificação" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
              <Input placeholder="Valor" value={specValue} onChange={(e) => setSpecValue(e.target.value)} />
              <Button type="button" onClick={addSpecification} variant="outline">
                Adicionar
              </Button>
            </div>

            {Object.entries(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {product ? "Atualizar Produto" : "Cadastrar Produto"}
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
