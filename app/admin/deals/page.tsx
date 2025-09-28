"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeals } from "@/hooks/use-deals"
import { useProducts } from "@/hooks/use-products"
import { ProductSelector } from "@/components/product-selector"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Percent } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DealsPage() {
  const { deals, isLoading, createDeal, updateDeal, deleteDeal, toggleDealStatus } = useDeals()
  const { products } = useProducts()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<any>(null)
  const [formData, setFormData] = useState({
    productId: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedProduct = products.find((p) => p.id === formData.productId)
    if (!selectedProduct) return

    const discountPercentage = Number(formData.discountPercentage)
    const originalPrice = selectedProduct.price
    const discountedPrice = originalPrice * (1 - discountPercentage / 100)

    const dealData = {
      productId: formData.productId,
      discountPercentage,
      originalPrice,
      discountedPrice,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: formData.isActive,
    }

    if (editingDeal) {
      await updateDeal(editingDeal.id, dealData)
    } else {
      await createDeal(dealData)
    }

    setIsDialogOpen(false)
    setEditingDeal(null)
    setFormData({
      productId: "",
      discountPercentage: "",
      startDate: "",
      endDate: "",
      isActive: true,
    })
  }

  const handleEdit = (deal: any) => {
    setEditingDeal(deal)
    setFormData({
      productId: deal.productId,
      discountPercentage: deal.discountPercentage.toString(),
      startDate: format(deal.startDate, "yyyy-MM-dd"),
      endDate: format(deal.endDate, "yyyy-MM-dd"),
      isActive: deal.isActive,
    })
    setIsDialogOpen(true)
  }

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Produto não encontrado"
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando ofertas...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Ofertas</h1>
          <p className="text-muted-foreground">Controle as promoções e descontos dos produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Oferta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingDeal ? "Editar Oferta" : "Nova Oferta"}</DialogTitle>
              <DialogDescription>
                {editingDeal ? "Edite os dados da oferta" : "Crie uma nova oferta promocional"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Produto</Label>
                <ProductSelector
                  products={products}
                  value={formData.productId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, productId: value }))}
                  placeholder="Busque e selecione um produto..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Desconto (%)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="90"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discountPercentage: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingDeal ? "Salvar Alterações" : "Criar Oferta"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Ofertas Ativas
          </CardTitle>
          <CardDescription>
            {deals.filter((deal) => deal.isActive).length} ofertas ativas de {deals.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Preço Original</TableHead>
                <TableHead>Preço com Desconto</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{getProductName(deal.productId)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{deal.discountPercentage}% OFF</Badge>
                  </TableCell>
                  <TableCell>R$ {deal.originalPrice.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-green-600">R$ {deal.discountedPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">
                    {format(deal.startDate, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                    {format(deal.endDate, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={deal.isActive ? "default" : "secondary"}>
                      {deal.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleDealStatus(deal.id)}>
                        {deal.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(deal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteDeal(deal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
