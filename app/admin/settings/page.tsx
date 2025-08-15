"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb } from "@/components/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Save, Store, Phone } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [storeSettings, setStoreSettings] = useState({
    name: "TechStore",
    description: "Sua loja completa de informática",
    email: "contato@techstore.com",
    phone: "(11) 3456-7890",
    address: "Rua da Tecnologia, 123 - Centro - São Paulo/SP",
    cep: "01234-567",
  })

  const handleSaveSettings = () => {
    // Simulação de salvamento
    toast({
      title: "Configurações salvas!",
      description: "As alterações foram aplicadas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Configurações" }]} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações da sua loja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Informações da Loja
            </CardTitle>
            <CardDescription>Configure as informações básicas da sua loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={storeSettings.name}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Descrição</Label>
              <Textarea
                id="storeDescription"
                value={storeSettings.description}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Informações de Contato
            </CardTitle>
            <CardDescription>Configure os dados de contato da loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={storeSettings.email}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={storeSettings.phone}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={storeSettings.address}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={storeSettings.cep}
                onChange={(e) => setStoreSettings((prev) => ({ ...prev, cep: e.target.value }))}
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Contato
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
          <CardDescription>Detalhes técnicos e estatísticas do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Versão do Sistema</h3>
              <p className="text-2xl font-bold text-blue-600">v1.0.0</p>
              <p className="text-sm text-blue-700">Última atualização: Hoje</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Status do Sistema</h3>
              <p className="text-2xl font-bold text-green-600">Online</p>
              <p className="text-sm text-green-700">Funcionando normalmente</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Backup</h3>
              <p className="text-2xl font-bold text-purple-600">Ativo</p>
              <p className="text-sm text-purple-700">Último backup: Ontem</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
