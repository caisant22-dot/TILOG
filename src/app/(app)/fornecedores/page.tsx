import type { Metadata } from 'next'
import { Truck } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Fornecedores' }

export default async function FornecedoresPage() {
  await requireModule('fornecedores')

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        description="Cadastre seus fornecedores, registre cotações e acompanhe o histórico de compras."
      />
      <ComingSoon
        moduleName="Cadastro de Fornecedores"
        description="Mantenha contatos, condições comerciais e histórico de pedidos centralizado."
        icon={<Truck className="w-6 h-6" />}
      />
    </div>
  )
}
