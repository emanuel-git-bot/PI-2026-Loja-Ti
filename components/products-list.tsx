"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { ProductForm } from "./product-form"
import { Edit, Trash2, Plus, Search, Star } from "lucide-react"
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

export function ProductsList() {
  const { products, categories, deleteProduct, toggleFeatured } = useProducts()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId)
    toast({
      title: "Produto excluído!",
      description: "O produto foi removido com sucesso.",
    })
  }

  const handleToggleFeatured = (productId: string, currentFeatured: boolean) => {
    toggleFeatured(productId)
    toast({
      title: currentFeatured ? "Produto removido dos destaques" : "Produto adicionado aos destaques",
      description: currentFeatured
        ? "O produto não aparecerá mais na seção de destaques."
        : "O produto agora aparecerá na seção de destaques.",
    })
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Categoria não encontrada"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>Preencha as informações do produto abaixo.</DialogDescription>
            </DialogHeader>
            <ProductForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{getCategoryName(product.categoryId)}</Badge>
                </div>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "Em estoque" : "Fora de estoque"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {product.imageUrls && product.imageUrls.length > 0 && (
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={product.imageUrls[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

              <div className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2).replace(".", ",")}</div>

              {Object.keys(product.specifications).length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Especificações:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    {Object.entries(product.specifications)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

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
                      <DialogTitle>Editar Produto</DialogTitle>
                      <DialogDescription>Faça as alterações necessárias no produto.</DialogDescription>
                    </DialogHeader>
                    <ProductForm product={product} onSuccess={() => setEditingProduct(null)} />
                  </DialogContent>
                </Dialog>

                <Button
                  variant={product.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleFeatured(product.id, product.featured || false)}
                  className={product.featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  <Star className={`h-4 w-4 ${product.featured ? "fill-current" : ""}`} />
                </Button>

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
                        Tem certeza que deseja excluir o produto "{product.name}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhum produto encontrado.</p>
            <Button className="mt-4" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeiro produto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
