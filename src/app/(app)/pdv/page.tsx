import type { Metadata } from 'next'
import { ShoppingCart } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'PDV' }

export default async function PdvPage() {
  await requireModule('pdv')

  return (
    <div>
      <PageHeader
        title="PDV"
        description="Frente de caixa para registrar vendas, gerenciar comandas e fechamento de turno."
      />
      <ComingSoon
        moduleName="Ponto de Venda"
        description="Sistema de PDV completo com integração de estoque, formas de pagamento e relatórios."
        icon={<ShoppingCart className="w-6 h-6" />}
      />
    </div>
  )
}
