import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import type { Database } from '@/types/database.types'

export type Plano = {
  id: string
  slug: string
  nome: string
  preco_mensal: number | null
  preco_anual: number | null
  descricao: string | null
  features: string[]
  destaque: boolean
  required_plan: string
  cta_label: string | null
  cta_url: string | null
  ativo: boolean
  ordem: number
}

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase env vars ausentes (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)')
  }
  return createSupabaseClient<Database>(url, key, { auth: { persistSession: false } })
}

export const getPlanos = unstable_cache(
  async (): Promise<Plano[]> => {
    try {
      const supabase = createPublicClient()
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true })

      if (error) {
        console.error('[getPlanos] erro Supabase:', error.message)
        return []
      }

      return (data ?? []).map((p) => ({
        ...p,
        destaque: p.destaque ?? false,
        required_plan: p.required_plan ?? 'free',
        ordem: p.ordem ?? 0,
        ativo: p.ativo ?? true,
        features: Array.isArray(p.features) ? (p.features as string[]) : [],
      }))
    } catch (err) {
      console.error('[getPlanos] exception:', err)
      return []
    }
  },
  ['planos-list'],
  { revalidate: 3600, tags: ['planos'] }
)
