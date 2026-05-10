import Link from 'next/link'

interface SuccessStateProps {
  nome: string
}

export function SuccessState({ nome }: SuccessStateProps) {
  return (
    <div className="text-center space-y-6 py-8 animate-fade-in">
      <div className="text-5xl">🎉</div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">
          Obrigado, {nome.split(' ')[0]}!
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Sua resposta vai direto para o time de produto.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[var(--radius-md)] bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] text-sm font-medium hover:bg-[var(--color-neutral-800)] transition-colors"
        >
          Criar conta gratuita →
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-neutral-50)] transition-colors"
        >
          Voltar para o início →
        </Link>
      </div>
    </div>
  )
}
