import { cookies } from 'next/headers'
import { requireSession } from '@/lib/auth/session'
import { SIDEBAR_SECTIONS } from '@/config/sidebar-items'
import { filterSidebarSections } from '@/lib/sidebar/filter-items'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { QueryProvider } from '@/components/providers/query-provider'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const cookieStore = await cookies()
  const pinnedCookie = cookieStore.get('tilog_sidebar_pinned')
  const initialPinned = pinnedCookie?.value === 'true'

  const filteredSections = filterSidebarSections(SIDEBAR_SECTIONS, session.enabledModules)

  return (
    <QueryProvider>
      <div className="min-h-screen bg-[var(--color-surface-raised)]">
        <Sidebar sections={filteredSections} initialPinned={initialPinned} />
        <Topbar userName={session.email?.split('@')[0]} userEmail={session.email} />
        <main
          className="pt-14 transition-[margin] duration-200"
          style={{ marginLeft: 'var(--sidebar-collapsed-width)' }}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </QueryProvider>
  )
}
