"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import type { Service } from "@/types"

export function useApiServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar serviços da API
  const loadServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getServicos()
      setServices(response.data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar serviços")
      console.error("Erro ao carregar serviços:", err)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar serviço
  const addService = async (service: Omit<Service, "id">) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.createServico(service)
      await loadServices() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar serviço")
      console.error("Erro ao adicionar serviço:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar serviço
  const updateService = async (id: string, service: Partial<Service>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.updateServico(id, service)
      await loadServices() // Recarregar lista
      return response.data
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar serviço")
      console.error("Erro ao atualizar serviço:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Remover serviço
  const removeService = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.deleteServico(id)
      await loadServices() // Recarregar lista
    } catch (err: any) {
      setError(err.message || "Erro ao remover serviço")
      console.error("Erro ao remover serviço:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Buscar serviços
  const searchServices = (query: string) => {
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadServices()
  }, [])

  return {
    services,
    loading,
    error,
    addService,
    updateService,
    removeService,
    searchServices,
    loadServices,
  }
}
