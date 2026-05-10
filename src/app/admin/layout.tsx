import { requireRole } from '@/lib/auth/session'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('superadmin')

  return (
    <div className="min-h-screen bg-[var(--color-surface-raised)]">
      <header className="sticky top-0 z-30 h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-text)] text-[var(--color-surface)]">
            ADMIN
          </span>
          <h1 className="text-sm font-medium text-[var(--color-text)]">Painel Tilog</h1>
        </div>
        <nav className="ml-8 flex gap-4 text-sm">
          <a href="/admin" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
            Visão geral
          </a>
          <a href="/admin/leads" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
            Leads
          </a>
          <a href="/admin/empresas" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
            Empresas
          </a>
        </nav>
        <div className="ml-auto">
          <a href="/dashboard" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]">
            Voltar ao app
          </a>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
