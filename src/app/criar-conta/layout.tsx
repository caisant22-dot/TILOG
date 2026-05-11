import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criar conta',
  description: 'Crie sua conta no Tilog em segundos.',
}

export default function CriarContaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
