import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RevealOnScroll } from '@/components/motion/reveal-on-scroll'
import {
  ArrowRight,
  Package,
  DollarSign,
  Users,
  ClipboardCheck,
  ShoppingCart,
  BarChart3,
  Sparkles,
  ListChecks,
  Clock,
  TrendingDown,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toda a sua operação em um só sistema',
  description:
    'Pare de perder dinheiro com planilha. Tilog é um sistema completo de gestão para food service, varejo, manutenção e serviços gerais.',
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
      {/* 1. Nav */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-[var(--color-text)]">Tilog</span>
          <div className="flex items-center gap-4">
            <Link href="/precos" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              Preços
            </Link>
            <Link
              href="/login"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              Entrar
            </Link>
            <Link
              href="/onboarding"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)] transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-neutral-100)] text-xs font-medium text-[var(--color-text-secondary)]">
              <Sparkles className="w-3 h-3" />
              4 verticais • 28 módulos • R$ 197/mês
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-[var(--color-text)] leading-[1.05] tracking-tight">
              Toda a sua operação em <span className="underline decoration-[var(--color-neutral-400)] decoration-4 underline-offset-8">um só sistema</span>
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-xl">
              Pare de perder dinheiro com planilha. Tilog organiza estoque, financeiro, equipe e operação numa única ferramenta — adaptada ao seu segmento.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
              >
                Começar grátis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/precos"
                className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:bg-[var(--color-neutral-50)] transition-colors"
              >
                Ver planos
              </Link>
            </div>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              Sem cartão de crédito • Comece em 3 minutos
            </p>
          </div>

          {/* Mockup do dashboard */}
          <DashboardMockup />
        </div>
      </section>

      {/* 3. Problema / Solução */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-[var(--color-border)]">
        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-danger-light)] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[var(--color-text-danger)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Você perde 10 horas por semana</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Conciliando planilha, anotação, WhatsApp e sistema de PDV. Cada um manda em um lugar — você não sabe mais o que é real.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-neutral-100)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--color-text)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Tilog centraliza tudo</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Um sistema. Um login. Estoque, financeiro, equipe, ordem de serviço, PDV — tudo conversa entre si.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-neutral-100)] flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[var(--color-text)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">Você economiza R$ 2.400/mês</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Em produtividade. Sem precisar contratar mais ninguém, sem assinar 4 sistemas diferentes.
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 4. Verticais */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <RevealOnScroll>
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-bold text-[var(--color-text)]">Feito para o seu segmento</h2>
            <p className="text-[var(--color-text-secondary)]">
              4 verticais com módulos específicos. Escolha o seu e ative só o que precisa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { slug: 'food-service', label: 'Food Service', icon: '🍽️', desc: 'Cardápio, fichas técnicas, eventos, PDV' },
              { slug: 'varejo', label: 'Varejo', icon: '🛍️', desc: 'Estoque, PDV, fornecedores, financeiro' },
              { slug: 'manutencao', label: 'Manutenção', icon: '🔧', desc: 'Ordem de serviço, escala, checklist' },
              { slug: 'servicos-gerais', label: 'Serviços Gerais', icon: '💼', desc: 'Equipe, financeiro, relatórios' },
            ].map((v) => (
              <Link
                key={v.slug}
                href={`/for/${v.slug}`}
                className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] hover:-translate-y-0.5 transition-all"
              >
                <span className="text-3xl">{v.icon}</span>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{v.label}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{v.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* 5. Como funciona */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-[var(--color-border)]">
        <RevealOnScroll>
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text)]">Como funciona</h2>
            <p className="text-[var(--color-text-secondary)]">3 passos. Sem implantação, sem treinamento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', t: 'Responda o quiz', d: '7 perguntas rápidas sobre o seu negócio. Leva 2 minutos.' },
              { n: '2', t: 'O sistema se adapta', d: 'Tilog ativa só os módulos que fazem sentido para o seu segmento.' },
              { n: '3', t: 'Comece em 5 minutos', d: 'Crie sua conta e já entre direto no dashboard com tudo configurado.' },
            ].map((step) => (
              <div key={step.n} className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] flex items-center justify-center font-bold">
                  {step.n}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{step.t}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{step.d}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* 6. Diferenciais */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <RevealOnScroll>
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-bold text-[var(--color-text)]">Tudo que você precisa, num só lugar</h2>
            <p className="text-[var(--color-text-secondary)]">28 módulos integrados. Use o que precisar.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: Package, label: 'Controle de estoque', desc: 'Entradas, saídas, perdas, inventário' },
              { icon: DollarSign, label: 'Financeiro completo', desc: 'Contas a pagar, receber, DRE' },
              { icon: Users, label: 'Gestão de equipe', desc: 'Funcionários, escala, treinamento' },
              { icon: ClipboardCheck, label: 'Checklists', desc: 'Operacionais, abertura, fechamento' },
              { icon: ShoppingCart, label: 'PDV integrado', desc: 'Vendas, cupom, formas de pagamento' },
              { icon: BarChart3, label: 'Relatórios', desc: 'DRE, fluxo de caixa, performance' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-neutral-100)] flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-[var(--color-text)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-text)] text-sm">{f.label}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* 7. Preços teaser */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 border-t border-[var(--color-border)]">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-[var(--color-text)]">Preço justo, sem surpresas</h2>
          <p className="text-[var(--color-text-secondary)]">
            Plano Profissional a partir de{' '}
            <span className="font-semibold text-[var(--color-text)]">R$ 197/mês</span>. Sem fidelidade, cancele quando quiser.
          </p>
          <Link
            href="/precos"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text)] underline underline-offset-4 mt-2"
          >
            Ver todos os planos <ArrowRight className="w-4 h-4" />
          </Link>
        </RevealOnScroll>
      </section>

      {/* 8. Pesquisa */}
      {leadCount > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <RevealOnScroll>
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">Sua opinião molda o produto</h2>
            <p className="text-[var(--color-text-secondary)]">
              {leadCount} empresário{leadCount !== 1 ? 's' : ''} já compartilharam suas dificuldades. Ajude a construir o Tilog que você precisa.
            </p>
            <Link
              href="/pesquisa"
              className="inline-flex items-center h-10 px-6 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-neutral-50)] transition-colors"
            >
              Responder pesquisa (3 minutos)
            </Link>
          </RevealOnScroll>
        </section>
      )}

      {/* 9. FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16 border-t border-[var(--color-border)]">
        <RevealOnScroll>
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-8">Perguntas frequentes</h2>
          <div className="space-y-2">
            {[
              { q: 'É realmente grátis?', a: 'Sim. O plano gratuito não tem limite de tempo. Use os módulos essenciais sem pagar.' },
              { q: 'Preciso de cartão de crédito?', a: 'Não. Você cria sua conta só com email e senha. Cartão só é necessário ao assinar um plano pago.' },
              { q: 'Funciona para qualquer tipo de negócio?', a: 'Tilog cobre food service, varejo, manutenção e serviços gerais. Outros segmentos: fale conosco pelo WhatsApp.' },
              { q: 'Posso migrar meus dados?', a: 'Sim. Importamos planilhas Excel/CSV no setup. Falamos com você durante a implantação.' },
              { q: 'Como funciona o cancelamento?', a: 'Cancele a qualquer momento. Seus dados ficam disponíveis por 90 dias para exportação.' },
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
        </RevealOnScroll>
      </section>

      {/* 10. CTA final */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 border-t border-[var(--color-border)]">
        <RevealOnScroll>
          <h2 className="text-4xl font-bold text-[var(--color-text)]">
            Comece agora. É grátis.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            7 perguntas, 3 minutos. Em seguida você cria sua conta e já entra no Tilog adaptado para o seu negócio.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
          >
            Começar grátis <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Sem cartão de crédito • Sem treinamento • Cancele quando quiser
          </p>
        </RevealOnScroll>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-tertiary)]">© 2026 Tilog. Todos os direitos reservados.</p>
          <div className="flex gap-4 text-sm text-[var(--color-text-tertiary)]">
            <Link href="/precos" className="hover:text-[var(--color-text)]">Preços</Link>
            <Link href="/pesquisa" className="hover:text-[var(--color-text)]">Pesquisa</Link>
            <Link href="/login" className="hover:text-[var(--color-text)]">Entrar</Link>
            <Link href="/onboarding" className="hover:text-[var(--color-text)]">Começar grátis</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function DashboardMockup() {
  return (
    <div className="relative">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-neutral-50)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-neutral-300)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-neutral-300)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-neutral-300)]" />
          <div className="ml-2 px-3 py-0.5 rounded-full bg-[var(--color-surface)] text-xs text-[var(--color-text-tertiary)] border border-[var(--color-border)]">
            tilog.app/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)]">Olá, Maria 👋</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">Restaurante Sabor & Arte</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              Online
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Receita', value: 'R$ 24.8k', delta: '+12%' },
              { label: 'Despesas', value: 'R$ 18.2k', delta: '-3%' },
              { label: 'Lucro', value: 'R$ 6.6k', delta: '+38%' },
            ].map((k) => (
              <div key={k.label} className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)] border border-[var(--color-border)]">
                <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wide">{k.label}</p>
                <p className="text-sm font-bold text-[var(--color-text)] mt-0.5">{k.value}</p>
                <p className="text-[10px] text-[var(--color-success)] font-medium">{k.delta}</p>
              </div>
            ))}
          </div>

          {/* Chart bars */}
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-neutral-50)] border border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Receita por dia</p>
            <div className="flex items-end gap-1 h-16">
              {[40, 60, 35, 80, 55, 90, 70, 65, 85, 75, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[var(--color-neutral-950)]"
                  style={{ height: `${h}%`, opacity: 0.7 + i / 40 }}
                />
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-1.5">
            {[
              { icon: ListChecks, label: 'Checklist abertura', sub: 'Concluído • 8:32' },
              { icon: Package, label: 'Recebimento de mercadoria', sub: 'Pendente • Fornec. ABC' },
              { icon: DollarSign, label: 'Pagamento aluguel', sub: 'Hoje • R$ 4.800' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2.5 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--color-neutral-50)]">
                <div className="w-7 h-7 rounded-md bg-[var(--color-neutral-100)] flex items-center justify-center shrink-0">
                  <row.icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--color-text)] truncate">{row.label}</p>
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{row.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
