"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TechStore</h1>
          <p className="text-xl text-gray-600">Sistema de Gerenciamento da Loja</p>
        </div>

        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
