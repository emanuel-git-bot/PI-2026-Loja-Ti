"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContatoPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulação de envio
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Entre em Contato</h1>
          <p className="text-gray-600">Estamos aqui para ajudar você com suas necessidades tecnológicas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="Como podemos ajudar?"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Descreva sua necessidade ou dúvida..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-gray-600">(11) 3456-7890</p>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contato@techstore.com</p>
                    <p className="text-gray-600">vendas@techstore.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-gray-600">Rua da Tecnologia, 123</p>
                    <p className="text-gray-600">Centro - São Paulo/SP</p>
                    <p className="text-gray-600">CEP: 01234-567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Horário de Funcionamento</p>
                    <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-gray-600">Sábado: 8h às 14h</p>
                    <p className="text-gray-600">Domingo: Fechado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atendimento Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Nossa equipe técnica está pronta para te ajudar com:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Consultoria em hardware</li>
                  <li>• Montagem de computadores</li>
                  <li>• Suporte técnico</li>
                  <li>• Orçamentos personalizados</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
