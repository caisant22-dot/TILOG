import type { Metadata } from 'next'
import { Trash2 } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Perdas — Estoque' }

export default async function PerdasPage() {
  await requireModule('estoque')

  return (
    <div>
      <PageHeader
        title="Registro de Perdas"
        description="Lance perdas, quebras e descartes para análise de impacto."
      />
      <ComingSoon
        moduleName="Perdas de Estoque"
        description="Categorize por motivo (vencimento, quebra, doação) e veja o impacto no resultado."
        icon={<Trash2 className="w-6 h-6" />}
      />
    </div>
  )
}
