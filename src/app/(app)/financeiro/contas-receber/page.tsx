import type { Metadata } from 'next'
import { TrendingUp } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Contas a Receber' }

export default async function ContasReceberPage() {
  await requireModule('financeiro')

  return (
    <div>
      <PageHeader
        title="Contas a Receber"
        description="Recebíveis, recorrências e previsão de entrada."
      />
      <ComingSoon
        moduleName="Contas a Receber"
        description="Acompanhe pagamentos pendentes, gere boletos e faça baixa automática."
        icon={<TrendingUp className="w-6 h-6" />}
      />
    </div>
  )
}
