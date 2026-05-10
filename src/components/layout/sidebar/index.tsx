'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PanelLeft, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { SidebarSection } from '@/config/sidebar-items'
import { cn } from '@/lib/utils'

interface SidebarProps {
  sections: SidebarSection[]
  initialPinned?: boolean
}

function getIcon(name: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  return Icon ?? LucideIcons.Circle
}

export function Sidebar({ sections, initialPinned = false }: SidebarProps) {
  const pathname = usePathname()
  const [pinned, setPinned] = useState(initialPinned)
  const [hovered, setHovered] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const expanded = pinned || hovered

  useEffect(() => {
    const handler = () => setMobileOpen(true)
    document.addEventListener('sidebar:open', handler)
    return () => document.removeEventListener('sidebar:open', handler)
  }, [])

  const togglePin = useCallback(() => {
    const next = !pinned
    setPinned(next)
    document.cookie = `tilog_sidebar_pinned=${next}; path=/; max-age=31536000`
  }, [pinned])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col',
          'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
          'transition-[width] duration-200 ease-in-out overflow-hidden',
          expanded
            ? 'w-[var(--sidebar-expanded-width)]'
            : 'w-[var(--sidebar-collapsed-width)]'
        )}
        onMouseEnter={() => !pinned && setTimeout(() => setHovered(true), 150)}
        onMouseLeave={() => !pinned && setTimeout(() => setHovered(false), 300)}
      >
        <SidebarContent
          sections={sections}
          expanded={expanded}
          pinned={pinned}
          isActive={isActive}
          onTogglePin={togglePin}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={cn(
              'fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col',
              'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
              'md:hidden animate-slide-in-left'
            )}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)]">
              <span className="font-semibold text-[var(--color-text)]">Tilog</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-[var(--color-neutral-100)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
              {sections.map((section, i) => (
                <SectionItems
                  key={i}
                  section={section}
                  expanded
                  isActive={isActive}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  )
}

function SidebarContent({
  sections,
  expanded,
  pinned,
  isActive,
  onTogglePin,
}: {
  sections: SidebarSection[]
  expanded: boolean
  pinned: boolean
  isActive: (href: string) => boolean
  onTogglePin: () => void
}) {
  return (
    <>
      <div className="flex items-center justify-between px-3 h-14 border-b border-[var(--color-border)] shrink-0">
        <span
          className={cn(
            'font-semibold text-[var(--color-text)] transition-opacity duration-150',
            expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          )}
        >
          Tilog
        </span>
        <button
          onClick={onTogglePin}
          className={cn(
            'p-1.5 rounded hover:bg-[var(--color-neutral-100)] transition-colors shrink-0',
            pinned && 'bg-[var(--color-neutral-100)]'
          )}
          title={pinned ? 'Desafixar menu' : 'Fixar menu'}
        >
          <PanelLeft className="h-4 w-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {sections.map((section, i) => (
          <SectionItems key={i} section={section} expanded={expanded} isActive={isActive} />
        ))}
      </nav>
    </>
  )
}

function SectionItems({
  section,
  expanded,
  isActive,
  onNavigate,
}: {
  section: SidebarSection
  expanded: boolean
  isActive: (href: string) => boolean
  onNavigate?: () => void
}) {
  return (
    <div className="mb-1">
      {section.title && expanded && (
        <p className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
          {section.title}
        </p>
      )}
      {section.items.map((item) => {
        const Icon = getIcon(item.icon)
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] transition-colors text-sm',
              'hover:bg-[var(--color-neutral-100)]',
              active
                ? 'bg-[var(--color-neutral-100)] font-semibold text-[var(--color-text)]'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {expanded && (
              <span className="truncate">{item.label}</span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
