"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/hooks/use-chat"
import { ChatBubble } from "@/components/chat-bubble"
import { ConversationListItem } from "@/components/conversation-list-item"
import { Input } from "@/components/ui/input"
import { QuickMessageSelector } from "@/components/quick-message-selector"
import type { ChatMessage } from "@/types"

export default function AdminChatPage() {
  const { user } = useAuth()
  const { conversations, sendMessage, getMessages, markAsRead, getTotalUnread } = useChat()
  const [selectedConversationId, setSelectedConversationId] = useState<string>("")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)
  const messages = selectedConversationId ? getMessages(selectedConversationId) : []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversationId && user) {
      markAsRead(selectedConversationId, user.id)
    }
  }, [selectedConversationId, user])

  const handleSend = () => {
    if (!message.trim() || !user || !selectedConversationId) return

    sendMessage(selectedConversationId, user.id, user.name, "admin", message.trim())
    setMessage("")
  }

  const handleSendSpecialMessage = (
    messageText: string,
    messageType: ChatMessage["messageType"],
    additionalData?: any,
  ) => {
    if (!user || !selectedConversationId) return

    sendMessage(selectedConversationId, user.id, user.name, "admin", messageText, messageType, additionalData)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === selectedConversationId}
                onClick={() => setSelectedConversationId(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b px-6 py-4">
              <h3 className="font-semibold text-gray-900">{selectedConversation.userName}</h3>
              <p className="text-sm text-gray-500">{selectedConversation.userEmail}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Nenhuma mensagem ainda</p>
                </div>
              ) : (
                messages.map((msg) => <ChatBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t p-4">
              <div className="flex items-end gap-2">
                <QuickMessageSelector onSendSpecialMessage={handleSendSpecialMessage} />
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Selecione uma conversa</p>
              <p className="text-sm">Escolha uma conversa da lista para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
