"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin padrão para demonstração
const DEFAULT_ADMIN: User = {
  id: "1",
  email: "admin@loja.com",
  name: "Administrador",
  role: "admin",
  createdAt: new Date(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulação de login - em produção seria uma API
    if (email === "admin@loja.com" && password === "admin123") {
      setUser(DEFAULT_ADMIN)
      localStorage.setItem("user", JSON.stringify(DEFAULT_ADMIN))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
