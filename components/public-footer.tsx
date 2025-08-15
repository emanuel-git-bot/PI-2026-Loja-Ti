export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">TechStore</h3>
            <p className="text-gray-300 mb-4">
              Sua loja completa de informática com os melhores produtos e serviços especializados.
            </p>
            <p className="text-gray-300">
              Oferecemos produtos de qualidade e assistência técnica especializada para todas as suas necessidades
              tecnológicas.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Processadores</li>
              <li>Placas de Vídeo</li>
              <li>Memória RAM</li>
              <li>Armazenamento</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Montagem de PC</li>
              <li>Instalação de SO</li>
              <li>Manutenção</li>
              <li>Suporte Técnico</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TechStore. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
