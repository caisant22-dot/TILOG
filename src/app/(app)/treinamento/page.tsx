import type { Metadata } from 'next'
import { GraduationCap } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Treinamento' }

export default async function TreinamentoPage() {
  await requireModule('treinamento')

  return (
    <div>
      <PageHeader
        title="Treinamentos"
        description="Capacite sua equipe com trilhas internas e acompanhe a conclusão."
      />
      <ComingSoon
        moduleName="Treinamento de Equipe"
        description="Crie módulos de treinamento, atribua a colaboradores e meça progresso."
        icon={<GraduationCap className="w-6 h-6" />}
      />
    </div>
  )
}
