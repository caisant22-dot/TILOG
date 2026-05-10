import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:   'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)]',
  secondary: 'bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)]',
  success:   'bg-[var(--color-success-light)] text-[var(--color-text-success)] border border-[var(--color-border-success)]',
  warning:   'bg-[var(--color-warning-light)] text-[var(--color-text-warning)] border border-[var(--color-border-warning)]',
  danger:    'bg-[var(--color-danger-light)] text-[var(--color-text-danger)] border border-[var(--color-border-danger)]',
  info:      'bg-[var(--color-background-info)] text-[var(--color-text-info)] border border-[var(--color-border-info)]',
}

function Badge({ className, variant = 'secondary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-full)] text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
