'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import type { Plano } from '@/lib/data/planos'
import { usePricing } from './pricing-toggle'
import { cn } from '@/lib/utils'

interface PlanCardProps {
  plano: Plano
}

function formatPrice(value: number | null, isAnual: boolean, precoAnual: number | null): string {
  if (value === null) return 'Sob consulta'
  if (value === 0) return 'Grátis'

  const monthly = isAnual && precoAnual ? precoAnual / 12 : value
  return `R$ ${monthly.toFixed(0).replace('.', ',')}/mês`
}

export function PlanCard({ plano }: PlanCardProps) {
  const { isAnual } = usePricing()

  const precoLabel = formatPrice(plano.preco_mensal, isAnual, plano.preco_anual)
  const isEnterprise = plano.preco_mensal === null

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[var(--radius-xl)] border bg-[var(--color-surface)] p-6',
        plano.destaque
          ? 'border-2 border-[var(--color-border-info)] shadow-lg'
          : 'border-[var(--color-border)]'
      )}
    >
      {plano.destaque && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-background-info)] text-[var(--color-text-info)] border border-[var(--color-border-info)]">
            Mais popular
          </span>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{plano.nome}</h3>
        {plano.descricao && (
          <p className="text-sm text-[var(--color-text-secondary)]">{plano.descricao}</p>
        )}
      </div>

      <div className="my-6">
        <p className="text-3xl font-bold text-[var(--color-text)]">{precoLabel}</p>
        {isAnual && plano.preco_anual && plano.preco_mensal && plano.preco_mensal > 0 && (
          <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
            Faturado R$ {plano.preco_anual.toFixed(0)}/ano
          </p>
        )}
      </div>

      <ul className="flex-1 space-y-2.5 mb-6">
        {plano.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
            <Check className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
            {feature}
          </li>
        ))}
      </ul>

      {isEnterprise ? (
        <a
          href={plano.cta_url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'block text-center py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
            'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)]'
          )}
        >
          {plano.cta_label ?? 'Contratar'}
        </a>
      ) : (
        <Link
          href={plano.cta_url ?? '/auth/register'}
          className={cn(
            'block text-center py-2.5 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
            plano.destaque
              ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)]'
              : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]'
          )}
        >
          {plano.cta_label ?? 'Começar'}
        </Link>
      )}
    </div>
  )
}
