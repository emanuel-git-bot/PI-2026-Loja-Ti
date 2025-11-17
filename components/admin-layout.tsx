import type React from "react"
import { AdminSidebar } from "./admin-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
