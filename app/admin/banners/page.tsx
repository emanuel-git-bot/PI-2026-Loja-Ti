"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useHeroBanners } from "@/hooks/use-hero-banners"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ImageIcon, ArrowUp, ArrowDown } from "lucide-react"

const BG_COLOR_OPTIONS = [
  { value: "bg-gradient-to-r from-blue-600 to-purple-700", label: "Azul para Roxo" },
  { value: "bg-gradient-to-r from-green-600 to-teal-700", label: "Verde para Azul-petróleo" },
  { value: "bg-gradient-to-r from-orange-600 to-red-700", label: "Laranja para Vermelho" },
  { value: "bg-gradient-to-r from-purple-600 to-pink-700", label: "Roxo para Rosa" },
  { value: "bg-gradient-to-r from-gray-600 to-gray-800", label: "Cinza Escuro" },
]

export default function BannersPage() {
  const { banners, isLoading, createBanner, updateBanner, deleteBanner, toggleBannerStatus, reorderBanners } =
    useHeroBanners()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    cta: "",
    link: "",
    imageUrl: "",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-700",
    order: 1,
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBanner) {
      await updateBanner(editingBanner.id, formData)
    } else {
      await createBanner(formData)
    }

    setIsDialogOpen(false)
    setEditingBanner(null)
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      cta: "",
      link: "",
      imageUrl: "",
      bgColor: "bg-gradient-to-r from-blue-600 to-purple-700",
      order: 1,
      isActive: true,
    })
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      cta: banner.cta,
      link: banner.link,
      imageUrl: banner.imageUrl,
      bgColor: banner.bgColor,
      order: banner.order,
      isActive: banner.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleReorder = async (bannerId: string, direction: "up" | "down") => {
    const banner = banners.find((b) => b.id === bannerId)
    if (!banner) return

    const newOrder = direction === "up" ? banner.order - 1 : banner.order + 1
    if (newOrder < 1 || newOrder > banners.length) return

    await reorderBanners(bannerId, newOrder)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Carregando banners...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Banners</h1>
          <p className="text-muted-foreground">Controle os banners do carrossel da página inicial</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</DialogTitle>
              <DialogDescription>
                {editingBanner ? "Edite os dados do banner" : "Crie um novo banner para o carrossel"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta">Texto do Botão</Label>
                  <Input
                    id="cta"
                    value={formData.cta}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cta: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link do Botão</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="/caminho/para/imagem.jpg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Cor de Fundo</Label>
                  <Select
                    value={formData.bgColor}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, bgColor: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BG_COLOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingBanner ? "Salvar Alterações" : "Criar Banner"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Banners do Carrossel
          </CardTitle>
          <CardDescription>
            {banners.filter((banner) => banner.isActive).length} banners ativos de {banners.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Subtítulo</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{banner.order}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleReorder(banner.id, "up")}
                          disabled={banner.order === 1}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => handleReorder(banner.id, "down")}
                          disabled={banner.order === banners.length}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>{banner.subtitle}</TableCell>
                  <TableCell>{banner.cta}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleBannerStatus(banner.id)}>
                        {banner.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteBanner(banner.id)}>
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
