import { getPlanos } from '@/lib/data/planos'
import { PricingProvider, PricingToggle } from './_components/pricing-toggle'
import { PlanCard } from './_components/plan-card'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos e Preços',
  description: 'Escolha o plano ideal para o seu negócio. Comece grátis, escale quando precisar.',
}

export default async function PrecosPage() {
  const planos = await getPlanos()

  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--color-text)]">Tilog</Link>
          <Link href="/login" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            Entrar →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text)]">Planos e Preços</h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Comece grátis e escale conforme seu negócio cresce.
          </p>

          <PricingProvider>
            <PricingToggle />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {planos.map((plano) => (
                <PlanCard key={plano.id} plano={plano} />
              ))}
            </div>
          </PricingProvider>
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Dúvidas?{' '}
            <a
              href="https://wa.me/5531991041211"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text)] underline underline-offset-2"
            >
              Fale conosco pelo WhatsApp
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
