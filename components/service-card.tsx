import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"
import type { Service } from "@/types"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge variant={service.available ? "default" : "secondary"}>
            {service.available ? "Disponível" : "Indisponível"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{service.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-xl font-bold">R$ {service.price.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration}</span>
          </div>
        </div>

        <Button className="w-full" disabled={!service.available}>
          {service.available ? "Solicitar Orçamento" : "Indisponível"}
        </Button>
      </CardContent>
    </Card>
  )
}
