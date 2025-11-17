"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceCard } from "@/components/service-card"
import { useServices } from "@/hooks/use-services"
import { Search } from 'lucide-react'

export default function ServicosPage() {
  const { services } = useServices()
  const [searchTerm, setSearchTerm] = useState("")

  const availableServices = services.filter((service) => service.available)

  const filteredServices = availableServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nossos Serviços</h1>
          <p className="text-gray-600 dark:text-gray-400">Assistência técnica especializada e serviços de qualidade</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm ? "Nenhum serviço encontrado para sua busca." : "Nenhum serviço disponível no momento."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
