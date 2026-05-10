import type { Metadata } from 'next'
import { Clock } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Escala' }

export default async function EscalaPage() {
  await requireModule('escala')

  return (
    <div>
      <PageHeader
        title="Escala de Equipe"
        description="Organize turnos, controle horários e visualize a operação semana a semana."
      />
      <ComingSoon
        moduleName="Escala Semanal"
        description="Monte escalas por função, controle folgas e veja o custo de mão-de-obra projetado."
        icon={<Clock className="w-6 h-6" />}
      />
    </div>
  )
}
