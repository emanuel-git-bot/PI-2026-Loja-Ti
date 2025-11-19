"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Columns2, Square } from 'lucide-react'

export function MobileGridControl() {
  const [columns, setColumns] = useState<1 | 2 | 3>(2)

  useEffect(() => {
    const saved = localStorage.getItem("mobile-grid-columns")
    if (saved) {
      setColumns(parseInt(saved) as 1 | 2 | 3)
    }
  }, [])

  const handleColumnsChange = (newColumns: 1 | 2 | 3) => {
    setColumns(newColumns)
    localStorage.setItem("mobile-grid-columns", newColumns.toString())
    // Dispara evento customizado para atualizar outros componentes
    window.dispatchEvent(new CustomEvent("mobile-grid-columns-change", { detail: newColumns }))
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 flex items-center gap-1 border border-gray-200 dark:border-gray-700">
        <Button
          variant={columns === 1 ? "default" : "ghost"}
          size="icon"
          onClick={() => handleColumnsChange(1)}
          className="rounded-full h-10 w-10"
          title="1 coluna"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant={columns === 2 ? "default" : "ghost"}
          size="icon"
          onClick={() => handleColumnsChange(2)}
          className="rounded-full h-10 w-10"
          title="2 colunas"
        >
          <Columns2 className="h-4 w-4" />
        </Button>
        <Button
          variant={columns === 3 ? "default" : "ghost"}
          size="icon"
          onClick={() => handleColumnsChange(3)}
          className="rounded-full h-10 w-10"
          title="3 colunas"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
