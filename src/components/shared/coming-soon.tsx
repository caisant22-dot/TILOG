type ComingSoonProps = {
  moduleName: string
  description?: string
  icon?: React.ReactNode
}

export function ComingSoon({ moduleName, description, icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-xl font-medium text-[var(--color-text)]">{moduleName}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
          {description ?? 'Este módulo está sendo construído e estará disponível em breve.'}
        </p>
      </div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs text-[var(--color-text-secondary)]">Em desenvolvimento</span>
      </div>
    </div>
  )
}
