import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Fichas Técnicas' }

export default async function FichasTecnicasPage() {
  await requireModule('fichas_tecnicas')

  return (
    <div>
      <PageHeader
        title="Fichas Técnicas"
        description="Padronize receitas e calcule o custo real por porção."
      />
      <ComingSoon
        moduleName="Fichas Técnicas"
        description="Cadastre ingredientes, defina rendimento por receita e visualize CMV automaticamente."
        icon={<BookOpen className="w-6 h-6" />}
      />
    </div>
  )
}
