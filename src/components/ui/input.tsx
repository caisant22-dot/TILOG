import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-9 px-3 text-sm rounded-[var(--radius-md)]',
            'bg-[var(--color-surface)] border border-[var(--color-border)]',
            'text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)]',
            'transition-colors',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-0 focus-visible:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[var(--color-danger)] focus-visible:outline-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-text-danger)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-text-tertiary)]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
