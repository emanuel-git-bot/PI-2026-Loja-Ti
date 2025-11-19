"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    // Aplicar tema salvo ou preferência do sistema
    const savedTheme = localStorage.getItem("theme")
    const theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return null
}
