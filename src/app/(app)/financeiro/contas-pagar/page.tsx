import type { Metadata } from 'next'
import { CreditCard } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Contas a Pagar' }

export default async function ContasPagarPage() {
  await requireModule('financeiro')

  return (
    <div>
      <PageHeader
        title="Contas a Pagar"
        description="Compromissos do mês, vencimentos e status de pagamento."
      />
      <ComingSoon
        moduleName="Contas a Pagar"
        description="Lance contas, classifique por categoria e gere alertas de vencimento próximos."
        icon={<CreditCard className="w-6 h-6" />}
      />
    </div>
  )
}
