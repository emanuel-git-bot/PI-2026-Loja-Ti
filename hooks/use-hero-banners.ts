"use client"

import { useState, useEffect } from "react"
import type { HeroBanner } from "@/types"

// Mock data baseado no carrossel atual
const MOCK_BANNERS: HeroBanner[] = [
  {
    id: "1",
    title: "Mega Promoção de Processadores",
    subtitle: "Até 30% OFF em Intel e AMD",
    description: "Aproveite os melhores preços em processadores de última geração",
    cta: "Ver Ofertas",
    link: "/loja/produtos?categoria=1",
    imageUrl: "/modern-computer-processor-promotion-banner.jpg",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-700",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Placas de Vídeo RTX 40 Series",
    subtitle: "Performance de nova geração",
    description: "Ray tracing e DLSS 3.0 para a melhor experiência gaming",
    cta: "Comprar Agora",
    link: "/loja/produtos?categoria=2",
    imageUrl: "/nvidia-rtx-graphics-card-gaming-setup.jpg",
    bgColor: "bg-gradient-to-r from-green-600 to-teal-700",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Memórias DDR5 em Oferta",
    subtitle: "Velocidade extrema para seu PC",
    description: "Upgrade sua máquina com as memórias mais rápidas do mercado",
    cta: "Ver Produtos",
    link: "/loja/produtos?categoria=3",
    imageUrl: "/ddr5-ram-memory-modules-computer.jpg",
    bgColor: "bg-gradient-to-r from-orange-600 to-red-700",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function useHeroBanners() {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setBanners(MOCK_BANNERS)
      setIsLoading(false)
    }, 500)
  }, [])

  const createBanner = async (bannerData: Omit<HeroBanner, "id" | "createdAt" | "updatedAt">) => {
    const newBanner: HeroBanner = {
      ...bannerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setBanners((prev) => [...prev, newBanner].sort((a, b) => a.order - b.order))
    return newBanner
  }

  const updateBanner = async (id: string, bannerData: Partial<HeroBanner>) => {
    setBanners((prev) =>
      prev
        .map((banner) => (banner.id === id ? { ...banner, ...bannerData, updatedAt: new Date() } : banner))
        .sort((a, b) => a.order - b.order),
    )
  }

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== id))
  }

  const toggleBannerStatus = async (id: string) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, isActive: !banner.isActive, updatedAt: new Date() } : banner,
      ),
    )
  }

  const reorderBanners = async (bannerId: string, newOrder: number) => {
    setBanners((prev) =>
      prev
        .map((banner) => (banner.id === bannerId ? { ...banner, order: newOrder, updatedAt: new Date() } : banner))
        .sort((a, b) => a.order - b.order),
    )
  }

  return {
    banners,
    isLoading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    reorderBanners,
  }
}
