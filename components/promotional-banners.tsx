"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function PromotionalBanners() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gaming Banner */}
          <Card className="overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-0">
              <div className="flex items-center h-48">
                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold mb-2">Setup Gamer Completo</h3>
                  <p className="text-purple-100 mb-4">Monte seu PC gamer dos sonhos com nossos kits especiais</p>
                  <Link href="/loja/produtos?categoria=2">
                    <Button variant="secondary" className="text-purple-700">
                      Montar PC
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 h-full">
                  <img src="/rgb-gaming-setup.png" alt="Gaming Setup" className="w-full h-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Banner */}
          <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-0">
              <div className="flex items-center h-48">
                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold mb-2">Workstation Pro</h3>
                  <p className="text-blue-100 mb-4">Equipamentos profissionais para criadores e desenvolvedores</p>
                  <Link href="/loja/produtos?categoria=1">
                    <Button variant="secondary" className="text-blue-700">
                      Ver Produtos
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 h-full">
                  <img
                    src="/professional-workstation-computer-setup.jpg"
                    alt="Professional Setup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
