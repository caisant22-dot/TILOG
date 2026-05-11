import Link from 'next/link'
import { KeyRound } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Recuperar senha' }

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-raised)] p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-[var(--color-text)]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Recuperar senha</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Em breve você poderá recuperar sua senha por aqui. Por enquanto, entre em contato pelo WhatsApp.
          </p>
        </div>

        <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
          <a
            href="https://wa.me/5531991041211"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-medium text-[var(--color-text)] underline underline-offset-2"
          >
            Falar pelo WhatsApp
          </a>
          <Link href="/login" className="block text-sm text-[var(--color-text-secondary)] underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
