import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Admin' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [leadsRes, empresasRes, leadsEntrevistaRes] = await Promise.all([
    supabase.from('pesquisa_leads').select('*', { count: 'exact', head: true }),
    supabase.from('empresas').select('*', { count: 'exact', head: true }).eq('ativo', true),
    supabase
      .from('pesquisa_leads')
      .select('*', { count: 'exact', head: true })
      .eq('aceita_entrevista', true),
  ])

  const stats = [
    { label: 'Leads capturados', value: leadsRes.count ?? 0 },
    { label: 'Empresas ativas', value: empresasRes.count ?? 0 },
    { label: 'Aceitam entrevista', value: leadsEntrevistaRes.count ?? 0 },
  ]

  return (
    <div>
      <PageHeader
        title="Visão geral"
        description="Indicadores da plataforma Tilog em tempo real."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-[var(--color-text)]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
