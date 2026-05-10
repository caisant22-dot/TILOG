import { requireSession } from '@/lib/auth/session'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await requireSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Bem-vindo, {session.email?.split('@')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita', value: 'R$ 0', delta: '+0%', variant: 'success' as const },
          { label: 'Despesas', value: 'R$ 0', delta: '+0%', variant: 'danger' as const },
          { label: 'Lucro', value: 'R$ 0', delta: '+0%', variant: 'success' as const },
          { label: 'Pedidos', value: '0', delta: '+0%', variant: 'secondary' as const },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[var(--color-text)]">{kpi.value}</p>
              <Badge variant={kpi.variant} className="mt-1">{kpi.delta}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulos ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {session.enabledModules.map((m) => (
              <Badge key={m} variant="secondary">{m}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
