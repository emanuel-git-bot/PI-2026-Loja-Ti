"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você precisa ser um administrador para acessar esta página.</p>
          <Link href="/">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <AdminLayout>{children}</AdminLayout>
}
