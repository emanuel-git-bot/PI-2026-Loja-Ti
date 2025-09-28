"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useServices } from "@/hooks/use-services"
import { ArrowRight, Wrench, Monitor, Cpu, HardDrive, Zap, Shield, Clock, DollarSign, CheckCircle } from "lucide-react"
import type { Service } from "@/types"

const serviceIcons = {
  Manutenção: Wrench,
  Instalação: Monitor,
  Upgrade: Cpu,
  Recuperação: HardDrive,
  Reparo: Zap,
  Consultoria: Shield,
}

const getServiceIcon = (serviceName: string) => {
  const iconKey = Object.keys(serviceIcons).find((key) => serviceName.toLowerCase().includes(key.toLowerCase()))
  return iconKey ? serviceIcons[iconKey as keyof typeof serviceIcons] : Wrench
}

interface EnhancedServiceCardProps {
  service: Service
}

function EnhancedServiceCard({ service }: EnhancedServiceCardProps) {
  const IconComponent = getServiceIcon(service.name)

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
      {/* Service Image Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300" />

      <CardContent className="relative p-6 space-y-4">
        {/* Icon and Badge */}
        <div className="flex items-start justify-between">
          <div className="bg-primary/10 group-hover:bg-primary/20 p-3 rounded-xl transition-colors duration-300">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <Badge
            variant={service.available ? "default" : "secondary"}
            className={service.available ? "bg-success text-success-foreground" : ""}
          >
            {service.available ? "Disponível" : "Indisponível"}
          </Badge>
        </div>

        {/* Service Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 mr-2 text-success" />
            <span>Garantia de 90 dias</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 mr-2 text-success" />
            <span>Técnicos certificados</span>
          </div>
        </div>

        {/* Price and Duration */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center text-success">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-2xl font-bold">R$ {service.price.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant={service.available ? "default" : "secondary"}
          disabled={!service.available}
        >
          {service.available ? "Solicitar Orçamento" : "Indisponível"}
          {service.available && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </CardContent>
    </Card>
  )
}

export function EnhancedServicesSection() {
  const { services } = useServices()
  const featuredServices = services.filter((service) => service.available).slice(0, 3)

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/professional-workstation-computer-setup.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/95" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">Nossos Serviços</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Assistência técnica especializada com profissionais certificados e garantia estendida
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredServices.map((service) => (
            <EnhancedServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">Precisa de um serviço personalizado?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para atender suas necessidades específicas com soluções sob medida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loja/servicos">
                <Button size="lg" className="min-w-[200px]">
                  Ver Todos os Serviços
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent">
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
