"use client"

import type { Conversation } from "@/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ConversationListItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationListItem({ conversation, isActive, onClick }: ConversationListItemProps) {
  const initials = conversation.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b",
        isActive && "bg-blue-50 hover:bg-blue-50",
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-blue-500 text-white">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{conversation.userName}</h3>
          <span className="text-xs text-gray-500">
            {format(new Date(conversation.lastMessageAt), "HH:mm", { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage || "Sem mensagens"}</p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
