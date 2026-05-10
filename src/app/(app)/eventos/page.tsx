import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { requireModule } from '@/lib/auth/session'
import { PageHeader } from '@/components/shared/page-header'
import { ComingSoon } from '@/components/shared/coming-soon'

export const metadata: Metadata = { title: 'Eventos' }

export default async function EventosPage() {
  await requireModule('eventos')

  return (
    <div>
      <PageHeader
        title="Eventos & Catering"
        description="Planeje eventos, organize a equipe e estime custos antecipadamente."
      />
      <ComingSoon
        moduleName="Eventos"
        description="Crie eventos, defina cardápio personalizado, escala dedicada e estoque planejado."
        icon={<Calendar className="w-6 h-6" />}
      />
    </div>
  )
}
