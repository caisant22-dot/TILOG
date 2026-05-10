import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Inbox } from 'lucide-react'

export const metadata: Metadata = { title: 'Leads'  }

const SEGMENTO_LABELS: Record<string, string> = {
  food_service: 'Food Service',
  varejo: 'Varejo',
  manutencao: 'Manutenção',
  servicos_gerais: 'Serviços',
  outro: 'Outro',
}

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('pesquisa_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <PageHeader
        title="Leads de pesquisa"
        description="Respostas do formulário de pesquisa público (últimas 100)."
      />

      {!leads || leads.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-5 h-5" />}
          title="Nenhum lead recebido ainda"
          description="As respostas aparecerão aqui assim que alguém preencher o formulário em /pesquisa."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-raised)] text-xs text-[var(--color-text-secondary)]">
              <tr>
                <th className="text-left p-3 font-medium">Nome</th>
                <th className="text-left p-3 font-medium">Contato</th>
                <th className="text-left p-3 font-medium">Segmento</th>
                <th className="text-left p-3 font-medium">Tamanho</th>
                <th className="text-left p-3 font-medium">Faixa preço</th>
                <th className="text-left p-3 font-medium">Entrevista?</th>
                <th className="text-left p-3 font-medium">Quando</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-[var(--color-border)]">
                  <td className="p-3 text-[var(--color-text)]">{lead.nome}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{lead.email || lead.whatsapp || '—'}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">
                    {SEGMENTO_LABELS[lead.segmento ?? ''] ?? lead.segmento ?? '—'}
                  </td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{lead.tamanho_empresa ?? '—'}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">{lead.faixa_preco ?? '—'}</td>
                  <td className="p-3 text-[var(--color-text-secondary)]">
                    {lead.aceita_entrevista ? 'Sim' : 'Não'}
                  </td>
                  <td className="p-3 text-[var(--color-text-tertiary)] text-xs">
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString('pt-BR') : '—'}
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
