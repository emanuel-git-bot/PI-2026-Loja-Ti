"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Monitor, Search, Menu, ShoppingCart, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"

const navigation = [
  { name: "Início", href: "/loja" },
  { name: "Produtos", href: "/loja/produtos" },
  { name: "Serviços", href: "/loja/servicos" },
  { name: "Contato", href: "/loja/contato" },
]

export function PublicHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const { cart } = useCart()
  const { favorites } = useFavorites()

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/loja" className="flex items-center">
            <Monitor className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-gray-700 hover:text-blue-600 transition-colors font-medium",
                  pathname === item.href && "text-blue-600 border-b-2 border-blue-600 pb-1",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            <Link href="/loja/favoritos">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/loja/carrinho">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        pathname === item.href ? "text-blue-600" : "text-gray-700 hover:text-blue-600",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="pt-4 border-t space-y-2">
                    <Link
                      href="/loja/favoritos"
                      className="flex items-center text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Favoritos ({favorites.length})
                    </Link>
                    <Link
                      href="/loja/carrinho"
                      className="flex items-center text-lg font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Carrinho ({cart.itemCount})
                    </Link>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">Painel Admin</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Buscar produtos..." className="pl-10" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
