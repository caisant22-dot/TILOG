import type { Metadata } from 'next'
import { Package } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Estoque' }

export default async function EstoquePage() {
  await requireModule('estoque')

  return (
    <div>
      <PageHeader
        title="Estoque"
        description="Controle de itens, posição atual e movimentações."
      />
      <ComingSoon
        moduleName="Controle de Estoque"
        description="Posição em tempo real, alertas de mínimo, inventário e rastreabilidade por lote."
        icon={<Package className="w-6 h-6" />}
      />
    </div>
  )
}
