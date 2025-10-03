"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  Monitor,
  Package,
  Tags,
  Settings,
  BarChart3,
  Users,
  Home,
  Store,
  LogOut,
  Menu,
  X,
  Percent,
  ImageIcon,
  Ticket,
  ShoppingCart,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Produtos", href: "/admin/products", icon: Package },
  { name: "Categorias", href: "/admin/categories", icon: Tags },
  { name: "Ofertas", href: "/admin/deals", icon: Percent },
  { name: "Cupons", href: "/admin/coupons", icon: Ticket },
  { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Serviços", href: "/admin/services", icon: Settings },
  { name: "Relatórios", href: "/admin/reports", icon: BarChart3 },
  { name: "Configurações", href: "/admin/settings", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-white">
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <Monitor className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">TechStore</h1>
              <p className="text-sm text-gray-500">Painel Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and actions */}
          <div className="border-t border-gray-200 p-4 space-y-4">
            <Link href="/loja" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Store className="h-4 w-4 mr-2" />
                Ver Loja Pública
              </Button>
            </Link>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
