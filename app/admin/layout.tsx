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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Acesso Negado</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Você precisa ser um administrador para acessar esta página.
          </p>
          <Link href="/">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <AdminLayout>{children}</AdminLayout>
}
