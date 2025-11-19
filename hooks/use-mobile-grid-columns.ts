"use client"

import { useState, useEffect } from "react"

export function useMobileGridColumns() {
  const [columns, setColumns] = useState<1 | 2 | 3>(2)

  useEffect(() => {
    // Carrega preferência salva
    const saved = localStorage.getItem("mobile-grid-columns")
    if (saved) {
      setColumns(parseInt(saved) as 1 | 2 | 3)
    }

    // Escuta mudanças do controle
    const handleChange = (e: CustomEvent) => {
      setColumns(e.detail as 1 | 2 | 3)
    }

    window.addEventListener("mobile-grid-columns-change", handleChange as EventListener)
    return () => {
      window.removeEventListener("mobile-grid-columns-change", handleChange as EventListener)
    }
  }, [])

  // Retorna classe Tailwind baseada no número de colunas
  const getGridClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-3"
      default:
        return "grid-cols-2"
    }
  }

  return { columns, gridClass: getGridClass() }
}
