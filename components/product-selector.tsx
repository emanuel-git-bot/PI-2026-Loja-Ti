"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"

interface ProductSelectorProps {
  products: Product[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function ProductSelector({
  products,
  value,
  onValueChange,
  placeholder = "Selecione um produto...",
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products

    return products.filter(
      (product) =>
        (product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [products, searchQuery])

  const selectedProduct = products.find((product) => product.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-[40px] p-3 bg-transparent"
        >
          {selectedProduct ? (
            <div className="flex items-center gap-3 flex-1 text-left">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {selectedProduct.imageUrls?.[0] ? (
                  <img
                    src={selectedProduct.imageUrls[0] || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    IMG
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{selectedProduct.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {selectedProduct.category}
                  </Badge>
                  <span className="text-sm font-semibold text-green-600">R$ {selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Buscar produtos..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {product.imageUrls?.[0] ? (
                      <img
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        IMG
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{product.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.brand && (
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                      )}
                      <span className="text-sm font-semibold text-green-600">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">{product.description}</div>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === product.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
