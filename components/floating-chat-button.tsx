"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useChat } from "@/hooks/use-chat"
import { useAuth } from "@/contexts/auth-context"
import { Textarea } from "@/components/ui/textarea"
import { ChatBubble } from "@/components/chat-bubble"
import { Card } from "@/components/ui/card"

export function FloatingChatButton() {
  const { user } = useAuth()
  const { getOrCreateConversation, sendMessage, getMessages, markAsRead, conversations } = useChat()
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [conversationId, setConversationId] = useState<string>("")
  const buttonRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Calcular mensagens não lidas
  const unreadCount = conversations.reduce((total, conv) => {
    return total + conv.messages.filter((m) => !m.read && m.sender !== "customer").length
  }, 0)

  useEffect(() => {
    // Posicionar no canto inferior direito inicialmente
    const updatePosition = () => {
      setPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100,
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    return () => window.removeEventListener("resize", updatePosition)
  }, [])

  useEffect(() => {
    if (user && isOpen) {
      const conv = getOrCreateConversation(user.id, user.name, user.email)
      setConversationId(conv.id)
      markAsRead(conv.id, user.id)
    }
  }, [user, isOpen])

  const messages = conversationId ? getMessages(conversationId) : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      const maxX = window.innerWidth - 80
      const maxY = window.innerHeight - 80

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart])

  const handleClick = () => {
    if (!isDragging) {
      setIsOpen(!isOpen)
    }
  }

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

  return (
    <>
      {isOpen && (
        <div
          className="fixed z-[9998] bottom-24 right-6 w-96 h-[600px] max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden bg-white border-4 border-gray-200"
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>

          {/* Header do chat */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Suporte TechStore</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Área de mensagens */}
          <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-2 bg-gray-50">
            {!user ? (
              <div className="flex items-center justify-center h-full">
                <Card className="p-6 text-center">
                  <p className="text-gray-600 mb-2">Faça login para usar o chat</p>
                </Card>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium mb-1">Bem-vindo ao suporte!</p>
                  <p className="text-sm">Envie uma mensagem para começar</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === user.id} />)
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensagem */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="resize-none min-h-[44px] max-h-24 text-sm"
                rows={1}
                disabled={!user}
              />
              <Button onClick={handleSend} disabled={!message.trim() || !user} size="icon" className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <div
        ref={buttonRef}
        className="fixed z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <div className="relative">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-white"
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </Button>

          {unreadCount > 0 && !isOpen && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}

          {!isOpen && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              Fale conosco
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
