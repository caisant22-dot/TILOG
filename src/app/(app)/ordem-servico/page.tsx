import type { Metadata } from 'next'
import { Wrench } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Ordens de Serviço' }

export default async function OrdemServicoPage() {
  await requireModule('ordem_servico')

  return (
    <div>
      <PageHeader
        title="Ordens de Serviço"
        description="Acompanhe ordens em aberto, em andamento e finalizadas."
      />
      <ComingSoon
        moduleName="Ordens de Serviço"
        description="Crie OS, atribua técnicos, controle prazos e gere o orçamento automaticamente."
        icon={<Wrench className="w-6 h-6" />}
      />
    </div>
  )
}
