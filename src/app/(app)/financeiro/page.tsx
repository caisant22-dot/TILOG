import type { Metadata } from 'next'
import { DollarSign } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Financeiro' }

export default async function FinanceiroPage() {
  await requireModule('financeiro')

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Controle entradas, saídas e a saúde financeira do negócio."
      />
      <ComingSoon
        moduleName="Gestão Financeira"
        description="Fluxo de caixa, contas a pagar/receber, conciliação bancária e DRE."
        icon={<DollarSign className="w-6 h-6" />}
      />
    </div>
  )
}
