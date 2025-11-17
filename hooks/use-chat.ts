"use client"

import { useState } from "react"
import type { ChatMessage, Conversation, MessageType } from "@/types"
import { useLocalStorage } from "./use-local-storage"

export function useChat() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>("conversations", [])
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>("chat-messages", [])
  const [loading, setLoading] = useState(false)

  // Criar ou obter conversa
  const getOrCreateConversation = (userId: string, userName: string, userEmail: string): Conversation => {
    const existing = conversations.find((c) => c.userId === userId)
    if (existing) return existing

    const newConversation: Conversation = {
      id: `CONV-${Date.now()}`,
      userId,
      userName,
      userEmail,
      lastMessageAt: new Date(),
      unreadCount: 0,
      createdAt: new Date(),
    }

    setConversations([...conversations, newConversation])
    return newConversation
  }

  // Enviar mensagem
  const sendMessage = (
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: "admin" | "user",
    message: string,
    messageType: MessageType = "text",
    additionalData?: {
      imageUrl?: string
      orderData?: ChatMessage["orderData"]
      serviceData?: ChatMessage["serviceData"]
      dealData?: ChatMessage["dealData"]
      couponData?: ChatMessage["couponData"]
    },
  ) => {
    const newMessage: ChatMessage = {
      id: `MSG-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderRole,
      message,
      messageType,
      imageUrl: additionalData?.imageUrl,
      orderData: additionalData?.orderData,
      serviceData: additionalData?.serviceData,
      dealData: additionalData?.dealData,
      couponData: additionalData?.couponData,
      isRead: false,
      createdAt: new Date(),
    }

    setMessages([...messages, newMessage])

    // Atualizar última mensagem da conversa
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: message,
              lastMessageAt: new Date(),
              unreadCount: senderRole === "user" ? conv.unreadCount + 1 : conv.unreadCount,
            }
          : conv,
      ),
    )
  }

  // Obter mensagens de uma conversa
  const getMessages = (conversationId: string): ChatMessage[] => {
    return messages
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // Marcar mensagens como lidas
  const markAsRead = (conversationId: string, userId: string) => {
    setMessages(
      messages.map((msg) =>
        msg.conversationId === conversationId && msg.senderId !== userId ? { ...msg, isRead: true } : msg,
      ),
    )

    setConversations(conversations.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
  }

  // Obter total de mensagens não lidas
  const getTotalUnread = (): number => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  // Obter mensagens não lidas de uma conversa
  const getUnreadCount = (conversationId: string): number => {
    const conv = conversations.find((c) => c.id === conversationId)
    return conv?.unreadCount || 0
  }

  return {
    conversations,
    messages,
    loading,
    getOrCreateConversation,
    sendMessage,
    getMessages,
    markAsRead,
    getTotalUnread,
    getUnreadCount,
  }
}
