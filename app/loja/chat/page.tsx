"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/hooks/use-chat"
import { ChatBubble } from "@/components/chat-bubble"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { getOrCreateConversation, sendMessage, getMessages, markAsRead } = useChat()
  const [message, setMessage] = useState("")
  const [conversationId, setConversationId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      const conv = getOrCreateConversation(user.id, user.name, user.email)
      setConversationId(conv.id)
      markAsRead(conv.id, user.id)
    }
  }, [user])

  const messages = conversationId ? getMessages(conversationId) : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!message.trim() || !user || !conversationId) return

    sendMessage(conversationId, user.id, user.name, "user", message.trim())
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para usar o chat</p>
          <Button onClick={() => router.push("/")}>Fazer Login</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Suporte TechStore</h2>
          <p className="text-xs text-gray-500">Atendimento ao cliente</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Bem-vindo ao suporte!</p>
              <p className="text-sm">Envie uma mensagem para começar a conversa</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === user.id} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="resize-none min-h-[44px] max-h-32"
            rows={1}
          />
          <Button onClick={handleSend} disabled={!message.trim()} size="icon" className="flex-shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
