import type { Metadata } from 'next'
import { BarChart } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Relatórios' }

export default async function RelatoriosPage() {
  await requireModule('relatorios')

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Visão consolidada de vendas, custos, equipe e estoque."
      />
      <ComingSoon
        moduleName="Relatórios Gerenciais"
        description="Dashboards prontos com exportação para Excel, PDF e indicadores customizáveis."
        icon={<BarChart className="w-6 h-6" />}
      />
    </div>
  )
}
