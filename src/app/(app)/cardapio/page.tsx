import type { Metadata } from 'next'
import { UtensilsCrossed } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Cardápio' }

export default async function CardapioPage() {
  await requireModule('cardapio')

  return (
    <div>
      <PageHeader
        title="Cardápio"
        description="Monte seu cardápio, organize categorias e gerencie itens disponíveis."
      />
      <ComingSoon
        moduleName="Módulo de Cardápio"
        description="Em breve você poderá cadastrar pratos, montar combos e controlar disponibilidade em tempo real."
        icon={<UtensilsCrossed className="w-6 h-6" />}
      />
    </div>
  )
}
