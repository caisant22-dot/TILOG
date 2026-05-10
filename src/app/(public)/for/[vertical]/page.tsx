import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const VERTICALS: Record<string, {
  title: string
  subtitle: string
  emoji: string
  modules: string[]
  cta: string
}> = {
  'food-service': {
    title: 'Tilog para Restaurantes & Food Service',
    subtitle: 'Do cardápio ao financeiro, tudo integrado para quem vive de cozinha.',
    emoji: '🍽️',
    modules: ['Cardápio & fichas técnicas', 'Controle de estoque', 'PDV e vendas', 'Eventos e catering', 'Escala de equipe', 'Financeiro e DRE'],
    cta: 'Criar conta grátis para food service',
  },
  'varejo': {
    title: 'Tilog para Varejo & Comércio',
    subtitle: 'Controle seu estoque, venda mais e acompanhe seu financeiro em tempo real.',
    emoji: '🛍️',
    modules: ['Controle de estoque', 'PDV e vendas', 'Gestão de fornecedores', 'Contas a pagar/receber', 'Relatórios e DRE', 'Funcionários'],
    cta: 'Criar conta grátis para varejo',
  },
  'manutencao': {
    title: 'Tilog para Manutenção & Serviços Técnicos',
    subtitle: 'Gerencie suas ordens de serviço, equipe e financeiro num único sistema.',
    emoji: '🔧',
    modules: ['Ordens de serviço', 'Escala da equipe', 'Checklists de inspeção', 'Controle financeiro', 'Relatórios de produtividade', 'Treinamentos'],
    cta: 'Criar conta grátis para manutenção',
  },
  'servicos-gerais': {
    title: 'Tilog para Serviços Gerais',
    subtitle: 'Organize sua equipe, controle finanças e acompanhe cada tarefa.',
    emoji: '💼',
    modules: ['Gestão de equipe', 'Controle financeiro', 'Checklists de serviço', 'Escala semanal', 'Relatórios', 'Treinamentos'],
    cta: 'Criar conta grátis',
  },
}

export async function generateStaticParams() {
  return Object.keys(VERTICALS).map((slug) => ({ vertical: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>
}): Promise<Metadata> {
  const { vertical } = await params
  const v = VERTICALS[vertical]
  if (!v) return {}
  return { title: v.title, description: v.subtitle }
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ vertical: string }>
}) {
  const { vertical } = await params
  const v = VERTICALS[vertical]
  if (!v) notFound()

  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--color-text)]">Tilog</Link>
          <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)] transition-colors">
            Entrar
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <span className="text-6xl">{v.emoji}</span>
        <h1 className="text-4xl font-bold text-[var(--color-text)]">{v.title}</h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">{v.subtitle}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
        >
          {v.cta}
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-center text-[var(--color-text)] mb-6">O que está incluído</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {v.modules.map((m) => (
            <div key={m} className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <span className="text-[var(--color-success)]">✓</span>
              <span className="text-sm text-[var(--color-text)]">{m}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
