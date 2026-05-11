import Link from 'next/link'
import { Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verifique seu email',
}

export default async function VerifiqueEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  const displayEmail = email ?? 'seu email'

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center">
          <Mail className="w-6 h-6 text-[var(--color-text)]" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Verifique seu email</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Enviamos um link de confirmação para{' '}
          <span className="font-medium text-[var(--color-text)]">{displayEmail}</span>.
        </p>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Clique no link para ativar sua conta e começar a usar o Tilog.
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Não recebeu o email? Verifique seu spam ou{' '}
          <Link href="/criar-conta" className="underline text-[var(--color-text)]">
            tente outro endereço
          </Link>
          .
        </p>
        <Link href="/login" className="block text-sm text-[var(--color-text-secondary)] underline">
          Já confirmei meu email — entrar
        </Link>
      </div>
    </div>
  )
}
