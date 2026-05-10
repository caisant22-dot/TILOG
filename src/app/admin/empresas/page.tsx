import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Empresas'  }

export default async function AdminEmpresasPage() {
  const supabase = await createClient()
  const { data: empresas } = await supabase
    .from('empresas')
    .select('*')
    .order('data_cadastro', { ascending: false })
    .limit(100)

  return (
    <div>
      <PageHeader
        title="Empresas cadastradas"
        description="Lista das empresas que completaram o onboarding (últimas 100)."
      />

      {!empresas || empresas.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-5 h-5" />}
          title="Nenhuma empresa ainda"
          description="As empresas aparecerão aqui após concluírem o onboarding."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-raised)] text-xs text-[var(--color-text-secondary)]">
              <tr>
                <th className="text-left p-3 font-medium">Empresa</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Plano</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Funcionários</th>
                <th className="text-left p-3 font-medium">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((emp) => (
                <tr key={emp.id} className="border-t border-[var(--color-border)]">
                  <td className="p-3 text-[var(--color-text)]">{emp.nome_empresa ?? '—'}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{emp.email ?? '—'}</td>
                  <td className="p-3">
                    <Badge variant={emp.plan === 'free' ? 'secondary' : 'success'}>
                      {emp.plan ?? 'free'}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        emp.account_status === 'ativo'
                          ? 'success'
                          : emp.account_status === 'suspenso'
                            ? 'danger'
                            : 'secondary'
                      }
                    >
                      {emp.account_status ?? '—'}
                    </Badge>
                  </td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{emp.num_funcionarios ?? 0}</td>
                  <td className="p-3 text-[var(--color-text-tertiary)] text-xs">
                    {emp.data_cadastro ? new Date(emp.data_cadastro).toLocaleDateString('pt-BR') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
