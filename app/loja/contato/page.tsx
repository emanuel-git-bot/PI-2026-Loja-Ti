"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from "@/contexts/auth-context"

export default function ContatoPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  
  const servicoNome = searchParams.get('servico')
  const servicoId = searchParams.get('servicoId')
  const servicoPreco = searchParams.get('preco')

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
    
    if (servicoNome) {
      setFormData(prev => ({
        ...prev,
        subject: `Orçamento - ${servicoNome}`,
        message: `Olá, gostaria de solicitar um orçamento para o serviço: ${servicoNome}${servicoPreco ? ` (R$ ${Number(servicoPreco).toFixed(2)})` : ''}.\n\nDetalhes da necessidade:\n`,
      }))
    }
  }, [user, servicoNome, servicoPreco])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Criar mensagem formatada para WhatsApp
    const whatsappMessage = `*Novo Contato da Loja*\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Telefone:* ${formData.phone || 'Não informado'}\n` +
      `*Assunto:* ${formData.subject}\n\n` +
      `*Mensagem:*\n${formData.message}`

    // Número do WhatsApp da loja (altere para o número real)
    const whatsappNumber = "5511999999999" // Formato: código do país + DDD + número
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank')

    toast({
      title: "Redirecionando para WhatsApp!",
      description: "Você será direcionado para o WhatsApp para finalizar o contato.",
    })

    // Limpar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Entre em Contato</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Estamos aqui para ajudar você com suas necessidades tecnológicas
          </p>
          {servicoNome && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-orange-900 dark:text-orange-200 font-medium">
                📋 Solicitando orçamento para: {servicoNome}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Envie sua Mensagem via WhatsApp
                </CardTitle>
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

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar via WhatsApp
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
                  <Phone className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="font-medium dark:text-white">Telefone</p>
                    <p className="text-gray-600 dark:text-gray-400">(11) 3456-7890</p>
                    <p className="text-gray-600 dark:text-gray-400">(11) 99999-9999</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="font-medium dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">contato@techstore.com</p>
                    <p className="text-gray-600 dark:text-gray-400">vendas@techstore.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="font-medium dark:text-white">Endereço</p>
                    <p className="text-gray-600 dark:text-gray-400">Rua da Tecnologia, 123</p>
                    <p className="text-gray-600 dark:text-gray-400">Centro - São Paulo/SP</p>
                    <p className="text-gray-600 dark:text-gray-400">CEP: 01234-567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-1" />
                  <div>
                    <p className="font-medium dark:text-white">Horário de Funcionamento</p>
                    <p className="text-gray-600 dark:text-gray-400">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-gray-600 dark:text-gray-400">Sábado: 8h às 14h</p>
                    <p className="text-gray-600 dark:text-gray-400">Domingo: Fechado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atendimento Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Nossa equipe técnica está pronta para te ajudar com:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
