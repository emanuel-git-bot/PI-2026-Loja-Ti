"use client"

import type { Service } from "@/types"
import { useLocalStorage } from "./use-local-storage"

const INITIAL_SERVICES: Service[] = [
  {
    id: "1",
    name: "Montagem de PC",
    description: "Montagem completa do seu computador com teste de funcionamento",
    price: 150.0,
    duration: "2-3 horas",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Instalação de Sistema Operacional",
    description: "Instalação e configuração do Windows ou Linux",
    price: 80.0,
    duration: "1-2 horas",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Manutenção Preventiva",
    description: "Limpeza interna, troca de pasta térmica e verificação geral",
    price: 120.0,
    duration: "1-2 horas",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useServices() {
  const [services, setServices] = useLocalStorage<Service[]>("services", INITIAL_SERVICES)

  const addService = (service: Omit<Service, "id" | "createdAt" | "updatedAt">) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setServices((prev) => [...prev, newService])
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((service) => (service.id === id ? { ...service, ...updates, updatedAt: new Date() } : service)),
    )
  }

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id))
  }

  return {
    services,
    addService,
    updateService,
    deleteService,
  }
}
