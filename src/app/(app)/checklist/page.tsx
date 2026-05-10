import type { Metadata } from 'next'
import { ClipboardCheck } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Checklists' }

export default async function ChecklistPage() {
  await requireModule('checklist')

  return (
    <div>
      <PageHeader
        title="Checklists"
        description="Crie modelos de checklist para abertura, fechamento e padrões operacionais."
      />
      <ComingSoon
        moduleName="Checklists Operacionais"
        description="Modele rotinas, atribua a equipes e acompanhe o cumprimento em tempo real."
        icon={<ClipboardCheck className="w-6 h-6" />}
      />
    </div>
  )
}
