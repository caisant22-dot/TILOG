import type { Metadata } from 'next'
import { Settings } from 'lucide-react'
import { requireSession } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Configurações' }

export default async function ConfiguracoesPage() {
  await requireSession()

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Gerencie sua empresa, usuários, plano e preferências."
      />
      <ComingSoon
        moduleName="Configurações"
        description="Em breve você poderá editar dados da empresa, gerenciar permissões e ajustar integrações."
        icon={<Settings className="w-6 h-6" />}
      />
    </div>
  )
}
