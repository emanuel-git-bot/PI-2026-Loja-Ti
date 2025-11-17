"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Package,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Tag,
  Wrench,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function UserDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/loja")
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
          <DropdownMenuLabel className="dark:text-gray-300">Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-gray-800" />
          <DropdownMenuItem asChild>
            <Link href="/loja/login" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Entrar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/loja/cadastro" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Cadastrar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="dark:bg-gray-800" />
          <div className="px-2 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-300">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 dark:bg-gray-900 dark:border-gray-800">
        <DropdownMenuLabel className="dark:text-gray-300">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-gray-800" />
        <DropdownMenuItem asChild>
          <Link href="/loja/perfil" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
            <Settings className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/loja/pedidos" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
            <Package className="mr-2 h-4 w-4" />
            <span>Meus Pedidos</span>
          </Link>
        </DropdownMenuItem>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator className="dark:bg-gray-800" />
            <DropdownMenuLabel className="text-xs text-muted-foreground dark:text-gray-400">
              Administração
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/products" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Produtos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/deals" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                <Tag className="mr-2 h-4 w-4" />
                <span>Ofertas</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/service-orders" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                <Wrench className="mr-2 h-4 w-4" />
                <span>Ordens de Serviço</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/orders" className="cursor-pointer dark:text-gray-300 dark:hover:bg-gray-800">
                <Package className="mr-2 h-4 w-4" />
                <span>Pedidos</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="dark:bg-gray-800" />
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-gray-300">Tema</span>
            <ThemeToggle />
          </div>
        </div>
        <DropdownMenuSeparator className="dark:bg-gray-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
