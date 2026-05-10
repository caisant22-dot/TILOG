import Link from 'next/link'
import { PesquisaForm } from './_components/pesquisa-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pesquisa de produto — Tilog',
  description: 'Você usa planilha ou WhatsApp para gerir seu negócio? Nos conta como você trabalha hoje — leva 3 minutos.',
}

export default function PesquisaPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--color-text)]">Tilog</Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Hero */}
          <div className="space-y-3">
            <div className="inline-flex px-3 py-1 rounded-full bg-[var(--color-neutral-100)] text-xs font-medium text-[var(--color-text-secondary)]">
              Sem spam. Sem vendas. Só produto.
            </div>
            <h1 className="text-3xl font-bold text-[var(--color-text)] leading-tight">
              Você usa planilha ou WhatsApp para gerir seu negócio?
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Estamos construindo algo diferente. Nos conta como você trabalha hoje — leva 3 minutos.
            </p>
          </div>

          {/* Form */}
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6">
            <PesquisaForm />
          </div>
        </div>
      </main>
    </div>
  )
}
