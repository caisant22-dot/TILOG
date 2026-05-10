'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  asChild?: boolean
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:
    'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)] active:bg-[var(--color-neutral-900)]',
  secondary:
    'bg-[var(--color-neutral-100)] text-[var(--color-text)] hover:bg-[var(--color-neutral-200)] active:bg-[var(--color-neutral-200)]',
  outline:
    'border border-[var(--color-border)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]',
  ghost:
    'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-neutral-100)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:opacity-90 active:opacity-100',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-7 px-3 text-xs rounded-[var(--radius-sm)]',
  md: 'h-9 px-4 text-sm rounded-[var(--radius-md)]',
  lg: 'h-11 px-6 text-base rounded-[var(--radius-md)]',
  icon: 'h-9 w-9 rounded-[var(--radius-md)] flex items-center justify-center',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, asChild, children, disabled, ...props }, ref) => {
    const sharedClass = cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-colors',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-2',
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild) {
      const Comp = Slot
      return (
        <Comp ref={ref} className={sharedClass} {...props}>
          {children}
        </Comp>
      )
    }

    return (
      <button ref={ref} disabled={disabled || loading} className={sharedClass} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
