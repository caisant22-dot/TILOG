import type { Metadata } from 'next'
import { FilePlus } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Nova OS' }

export default async function NovaOrdemPage() {
  await requireModule('ordem_servico')

  return (
    <div>
      <PageHeader
        title="Nova Ordem de Serviço"
        description="Cadastre uma nova OS com cliente, equipamento, descrição e prazo."
      />
      <ComingSoon
        moduleName="Cadastro de OS"
        description="Formulário completo de OS com upload de fotos, assinatura e histórico do equipamento."
        icon={<FilePlus className="w-6 h-6" />}
      />
    </div>
  )
}
