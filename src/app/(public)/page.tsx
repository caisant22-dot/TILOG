import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tilog — Gestão empresarial para todos os segmentos',
  description: 'Organize seu negócio com um sistema completo: estoque, financeiro, escala, checklist e muito mais.',
}

export const revalidate = 3600

async function getLeadCount() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from('pesquisa_leads')
      .select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function LandingPage() {
  const leadCount = await getLeadCount()

  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-[var(--color-text)]">Tilog</span>
          <div className="flex items-center gap-4">
            <Link href="/precos" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              Preços
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)] transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex px-3 py-1 rounded-full bg-[var(--color-neutral-100)] text-xs font-medium text-[var(--color-text-secondary)]">
          Gestão empresarial multi-vertical
        </div>
        <h1 className="text-5xl font-bold text-[var(--color-text)] leading-tight">
          Organize seu negócio<br />de verdade
        </h1>
        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Do restaurante à loja de varejo: controle de estoque, financeiro, escala de equipe, checklist e muito mais — num só lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
          >
            Criar conta grátis
          </Link>
          <Link
            href="/precos"
            className="inline-flex items-center justify-center h-11 px-6 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-neutral-50)] transition-colors"
          >
            Ver planos
          </Link>
        </div>
      </section>

      {/* Verticais */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center text-[var(--color-text)] mb-8">
          Para cada segmento, uma solução
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { slug: 'food-service', label: 'Restaurante & Food Service', icon: '🍽️', desc: 'Cardápio, fichas técnicas, eventos e PDV' },
            { slug: 'varejo', label: 'Varejo & Comércio', icon: '🛍️', desc: 'Estoque, PDV, fornecedores e financeiro' },
            { slug: 'manutencao', label: 'Manutenção Técnica', icon: '🔧', desc: 'Ordens de serviço, escala e checklists' },
            { slug: 'servicos-gerais', label: 'Serviços Gerais', icon: '💼', desc: 'Gestão de equipe, financeiro e relatórios' },
          ].map((v) => (
            <Link
              key={v.slug}
              href={`/for/${v.slug}`}
              className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors"
            >
              <span className="text-3xl">{v.icon}</span>
              <div>
                <p className="font-semibold text-[var(--color-text)]">{v.label}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{v.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Preços destaque */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">Preço justo, sem surpresas</h2>
        <p className="text-[var(--color-text-secondary)]">
          Plano Profissional a partir de{' '}
          <span className="font-semibold text-[var(--color-text)]">R$ 197/mês</span>
          {' '}— tudo incluído.
        </p>
        <Link
          href="/precos"
          className="inline-flex items-center text-sm font-medium text-[var(--color-text)] underline underline-offset-4"
        >
          Ver todos os planos →
        </Link>
      </section>

      {/* Seção Pesquisa — sua opinião molda o produto */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 border-t border-[var(--color-border)]">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Sua opinião molda o produto</h2>
          <p className="text-[var(--color-text-secondary)]">
            Conta como você gerencia seu negócio hoje — leva 3 minutos e vai direto para o time de produto.
          </p>
          {leadCount > 0 && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {leadCount} empresário{leadCount !== 1 ? 's' : ''} já respondeu{leadCount !== 1 ? 'ram' : ''}
            </p>
          )}
        </div>
        <Link
          href="/pesquisa"
          className="inline-flex items-center justify-center h-10 px-6 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] text-sm font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
        >
          Responder pesquisa →
        </Link>
      </section>

      {/* FAQ simples */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-center text-[var(--color-text)] mb-8">Perguntas frequentes</h2>
        <div className="space-y-2">
          {[
            { q: 'É realmente grátis?', a: 'Sim, o plano Grátis não tem limite de tempo. Você pode usar os módulos essenciais sem pagar nada.' },
            { q: 'Preciso de cartão de crédito?', a: 'Não. Para criar sua conta grátis, basta e-mail e senha. Cartão só é necessário ao assinar um plano pago.' },
            { q: 'Funciona para qualquer tipo de negócio?', a: 'O Tilog é projetado para food service, varejo, manutenção e serviços gerais. Cada vertical tem módulos específicos.' },
          ].map((item) => (
            <details
              key={item.q}
              className="group border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-surface)]"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[var(--color-text)] list-none">
                {item.q}
                <span className="text-[var(--color-text-tertiary)] group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-[var(--color-text-secondary)]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-tertiary)]">© 2026 Tilog. Todos os direitos reservados.</p>
          <div className="flex gap-4 text-sm text-[var(--color-text-tertiary)]">
            <Link href="/precos" className="hover:text-[var(--color-text)]">Preços</Link>
            <Link href="/pesquisa" className="hover:text-[var(--color-text)]">Pesquisa</Link>
            <Link href="/login" className="hover:text-[var(--color-text)]">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
