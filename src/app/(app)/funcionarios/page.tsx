import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Funcionários' }

export default async function FuncionariosPage() {
  await requireModule('funcionarios')

  return (
    <div>
      <PageHeader
        title="Funcionários"
        description="Cadastre colaboradores, defina funções e acesse o histórico de cada um."
      />
      <ComingSoon
        moduleName="Gestão de Funcionários"
        description="Cadastros completos, controle de admissão, função, salário e desempenho."
        icon={<Users className="w-6 h-6" />}
      />
    </div>
  )
}
