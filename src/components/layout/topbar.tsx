'use client'

import { useState } from 'react'
import { LogOut, Settings, User, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface TopbarProps {
  userName?: string
  userEmail?: string
}

export function Topbar({ userName, userEmail }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-14',
        'left-[var(--sidebar-collapsed-width)]',
        'flex items-center justify-between px-4',
        'bg-[var(--color-background)] border-b border-[var(--color-border)]'
      )}
      style={{ left: 'var(--sidebar-collapsed-width)' }}
    >
      <button
        className="md:hidden p-2 rounded hover:bg-[var(--color-neutral-100)]"
        onClick={() => document.dispatchEvent(new Event('sidebar:open'))}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          className="flex items-center gap-2 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-100)] transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <Avatar name={userName} size="sm" />
          <span className="hidden sm:block text-sm text-[var(--color-text)] max-w-[140px] truncate">
            {userName ?? userEmail ?? 'Usuário'}
          </span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className={cn(
                'absolute right-0 top-full mt-1 w-52 z-50',
                'bg-[var(--color-surface)] border border-[var(--color-border)]',
                'rounded-[var(--radius-lg)] shadow-lg py-1',
                'animate-scale-in'
              )}
            >
              <div className="px-3 py-2 border-b border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{userName}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => { setOpen(false); router.push('/configuracoes') }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]"
              >
                <Settings className="h-4 w-4" /> Configurações
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-danger)] hover:bg-[var(--color-danger-light)]"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
