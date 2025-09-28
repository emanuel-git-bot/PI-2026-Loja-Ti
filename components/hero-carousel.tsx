"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const HERO_SLIDES = [
  {
    id: 1,
    title: "Mega Promoção de Processadores",
    subtitle: "Até 30% OFF em Intel e AMD",
    description: "Aproveite os melhores preços em processadores de última geração",
    cta: "Ver Ofertas",
    link: "/loja/produtos?categoria=1",
    image: "/modern-computer-processor-promotion-banner.jpg",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-700",
  },
  {
    id: 2,
    title: "Placas de Vídeo RTX 40 Series",
    subtitle: "Performance de nova geração",
    description: "Ray tracing e DLSS 3.0 para a melhor experiência gaming",
    cta: "Comprar Agora",
    link: "/loja/produtos?categoria=2",
    image: "/nvidia-rtx-graphics-card-gaming-setup.jpg",
    bgColor: "bg-gradient-to-r from-green-600 to-teal-700",
  },
  {
    id: 3,
    title: "Memórias DDR5 em Oferta",
    subtitle: "Velocidade extrema para seu PC",
    description: "Upgrade sua máquina com as memórias mais rápidas do mercado",
    cta: "Ver Produtos",
    link: "/loja/produtos?categoria=3",
    image: "/ddr5-ram-memory-modules-computer.jpg",
    bgColor: "bg-gradient-to-r from-orange-600 to-red-700",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className={`${slide.bgColor} h-full flex items-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-2 text-blue-100">{slide.subtitle}</p>
                <p className="text-lg mb-8 text-blue-50">{slide.description}</p>
                <Link href={slide.link}>
                  <Button size="lg" variant="secondary" className="text-primary font-semibold">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
