import type { Metadata } from 'next'
import { BarChart2 } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'DRE — Relatórios' }

export default async function RelatoriosDrePage() {
  await requireModule('relatorios')

  return (
    <div>
      <PageHeader
        title="DRE Gerencial"
        description="Demonstrativo de resultado por mês, trimestre e ano."
      />
      <ComingSoon
        moduleName="DRE Gerencial"
        description="DRE consolidada com comparativos, projeções e exportação contábil."
        icon={<BarChart2 className="w-6 h-6" />}
      />
    </div>
  )
}
