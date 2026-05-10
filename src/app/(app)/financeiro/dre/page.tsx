import type { Metadata } from 'next'
import { BarChart2 } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'DRE — Financeiro' }

export default async function DrePage() {
  await requireModule('financeiro')

  return (
    <div>
      <PageHeader
        title="DRE"
        description="Demonstração do resultado consolidada do período."
      />
      <ComingSoon
        moduleName="DRE"
        description="Visão de receitas, custos diretos, despesas operacionais e EBITDA."
        icon={<BarChart2 className="w-6 h-6" />}
      />
    </div>
  )
}
