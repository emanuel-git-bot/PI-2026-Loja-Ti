"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useCoupons } from "@/hooks/use-coupons"
import { Plus, Pencil, Trash2, Ticket, Calendar, TrendingUp } from "lucide-react"
import type { Coupon } from "@/types"

export default function CouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCoupons()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usageLimit: 100,
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxDiscountAmount: formData.maxDiscountAmount || undefined,
      })
    } else {
      addCoupon({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxDiscountAmount: formData.maxDiscountAmount || undefined,
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minPurchaseAmount: 0,
      maxDiscountAmount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      usageLimit: 100,
      isActive: true,
    })
    setEditingCoupon(null)
    setIsFormOpen(false)
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      startDate: new Date(coupon.startDate).toISOString().split("T")[0],
      endDate: new Date(coupon.endDate).toISOString().split("T")[0],
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    })
    setIsFormOpen(true)
  }

  const activeCoupons = coupons.filter((c) => c.isActive)
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cupons de Desconto</h1>
          <p className="text-gray-600 mt-1">Gerencie cupons promocionais da loja</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Cupons</p>
                <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cupons Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeCoupons.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Usos</p>
                <p className="text-2xl font-bold text-purple-600">{totalUsage}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCoupon ? "Editar Cupom" : "Novo Cupom"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código do Cupom *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ex: BEMVINDO10"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discountType">Tipo de Desconto *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">
                    Valor do Desconto * {formData.discountType === "percentage" ? "(%)" : "(R$)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minPurchaseAmount">Valor Mínimo de Compra (R$)</Label>
                  <Input
                    id="minPurchaseAmount"
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                  />
                </div>

                {formData.discountType === "percentage" && (
                  <div>
                    <Label htmlFor="maxDiscountAmount">Desconto Máximo (R$) - Opcional</Label>
                    <Input
                      id="maxDiscountAmount"
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="usageLimit">Limite de Uso</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data de Término</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do cupom"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Cupom Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingCoupon ? "Atualizar" : "Criar"} Cupom</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Cupons */}
      <Card>
        <CardHeader>
          <CardTitle>Cupons Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum cupom cadastrado</p>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{coupon.code}</h3>
                        <Badge variant={coupon.isActive ? "default" : "secondary"}>
                          {coupon.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        {new Date() > coupon.endDate && <Badge variant="destructive">Expirado</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Desconto:</span>
                          <p className="font-semibold">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : `R$ ${coupon.discountValue.toFixed(2)}`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Mín. Compra:</span>
                          <p className="font-semibold">R$ {coupon.minPurchaseAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Usos:</span>
                          <p className="font-semibold">
                            {coupon.usageCount} / {coupon.usageLimit}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Válido até:</span>
                          <p className="font-semibold">{new Date(coupon.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Deseja realmente excluir este cupom?")) {
                            deleteCoupon(coupon.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
