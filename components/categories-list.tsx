"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { CategoryForm } from "./category-form"
import { Edit, Trash2, Plus, Package } from "lucide-react"
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

export function CategoriesList() {
  const { categories, products, deleteCategory } = useProducts()
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleDeleteCategory = (categoryId: string) => {
    const productsInCategory = products.filter((product) => product.categoryId === categoryId)

    if (productsInCategory.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Esta categoria possui ${productsInCategory.length} produto(s). Remova os produtos primeiro.`,
        variant: "destructive",
      })
      return
    }

    deleteCategory(categoryId)
    toast({
      title: "Categoria excluída!",
      description: "A categoria foi removida com sucesso.",
    })
  }

  const getProductCount = (categoryId: string) => {
    return products.filter((product) => product.categoryId === categoryId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>Preencha as informações da categoria abaixo.</DialogDescription>
            </DialogHeader>
            <CategoryForm onSuccess={() => setShowAddForm(false)} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const productCount = getProductCount(category.id)

          return (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Package className="h-4 w-4 mr-1" />
                    {productCount}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{category.description}</p>

                <div className="text-xs text-gray-500">
                  Criada em: {new Date(category.createdAt).toLocaleDateString("pt-BR")}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                        <DialogDescription>Faça as alterações necessárias na categoria.</DialogDescription>
                      </DialogHeader>
                      <CategoryForm category={category} />
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
                          Tem certeza que deseja excluir a categoria "{category.name}"?
                          {productCount > 0 && (
                            <span className="block mt-2 text-red-600 font-medium">
                              Atenção: Esta categoria possui {productCount} produto(s) que também serão removidos.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma categoria encontrada.</p>
            <Button className="mt-4" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeira categoria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
