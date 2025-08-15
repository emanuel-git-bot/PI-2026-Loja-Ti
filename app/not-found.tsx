import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Página não encontrada</h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida para outro local.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/loja">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Ir para Loja
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Painel Admin
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
