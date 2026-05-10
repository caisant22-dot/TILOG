import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'superadmin' | 'admin' | 'gestor' | 'funcionario' | 'anonymous'
export type Plan = 'free' | 'paid'

export interface TilogSession {
  userId: string
  email: string
  empresaId: string | null
  role: UserRole
  enabledModules: string[]
  plan: Plan
  vertical: string | null
}

export async function getSession(): Promise<TilogSession | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const meta = user.app_metadata ?? {}

  return {
    userId: user.id,
    email: user.email ?? '',
    empresaId: meta.empresa_id ?? null,
    role: (meta.user_role ?? 'anonymous') as UserRole,
    enabledModules: meta.enabled_modules ?? [],
    plan: (meta.plan ?? 'free') as Plan,
    vertical: meta.vertical ?? null,
  }
}

export async function requireSession(): Promise<TilogSession> {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

export async function requireRole(...roles: UserRole[]): Promise<TilogSession> {
  const session = await requireSession()
  if (!roles.includes(session.role)) redirect('/acesso-negado')
  return session
}

export async function requireModule(slug: string): Promise<TilogSession> {
  const session = await requireSession()
  if (!session.enabledModules.includes(slug)) {
    redirect(`/acesso-negado?module=${slug}`)
  }
  return session
}

export function hasModule(session: TilogSession, slug: string): boolean {
  return session.enabledModules.includes(slug)
}
