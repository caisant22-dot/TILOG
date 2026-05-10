import type { Metadata } from 'next'
import { ListChecks } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Execução — Checklist' }

export default async function ChecklistExecucaoPage() {
  await requireModule('checklist')

  return (
    <div>
      <PageHeader
        title="Execução de Checklist"
        description="Acompanhe checklists em andamento e revise os concluídos."
      />
      <ComingSoon
        moduleName="Execução de Checklists"
        description="Visualize a execução em tempo real, com fotos, observações e responsáveis por cada item."
        icon={<ListChecks className="w-6 h-6" />}
      />
    </div>
  )
}
