import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Acesso negado' }

export default function AcessoNegadoPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-4xl">🔒</p>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Acesso restrito</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Você não tem permissão para acessar esta área.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--color-text)] underline underline-offset-2"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
