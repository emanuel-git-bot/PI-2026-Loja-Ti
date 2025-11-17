"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Monitor, Search, Menu, ShoppingCart, Heart, Package, MessageCircle, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { UserDropdown } from "@/components/user-dropdown"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/types"

const navigation = [
  { name: "Início", href: "/loja" },
  { name: "Produtos", href: "/loja/produtos" },
  { name: "Serviços", href: "/loja/servicos" },
  { name: "Contato", href: "/loja/contato" },
]

export function PublicHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const pathname = usePathname()
  const router = useRouter()

  const { cart } = useCart()
  const { favorites } = useFavorites()
  const { products, categories } = useProducts()

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(filtered.slice(0, 5)) // Mostra no máximo 5 resultados
    } else {
      setSearchResults([])
    }
  }, [searchQuery, products])

  const handleProductClick = (productId: string) => {
    router.push(`/loja/produtos/${productId}`)
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Sem categoria"
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/loja" className="flex items-center">
            <Monitor className="h-8 w-8 text-primary dark:text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TechStore</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium",
                  pathname === item.href && "text-primary dark:text-primary border-b-2 border-primary pb-1",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
            </Button>

            <UserDropdown />

            <Link href="/loja/chat">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/loja/pedidos">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Package className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/loja/favoritos">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/loja/carrinho">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-gray-700 dark:text-gray-300">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="dark:bg-gray-900 dark:border-gray-800">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors",
                        pathname === item.href
                          ? "text-primary dark:text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="pt-4 border-t dark:border-gray-800 space-y-2">
                    <Link
                      href="/loja/chat"
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Chat com Suporte
                    </Link>
                    <Link
                      href="/loja/pedidos"
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/loja/favoritos"
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Favoritos ({favorites.length})
                    </Link>
                    <Link
                      href="/loja/carrinho"
                      className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Carrinho ({cart.itemCount})
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleCloseSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown de resultados */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-b-0"
                  >
                    <img
                      src={product.imageUrls?.[0] || "/placeholder.svg?height=60&width=60"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {getCategoryName(product.categoryId)}
                        </span>
                        <span className="text-sm font-bold text-primary">R$ {(product.price ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Mensagem quando não há resultados */}
            {searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Nenhum produto encontrado para "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
