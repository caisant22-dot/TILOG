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

// Client sem cookies — planos são leitura pública (RLS permite anon)
function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export const getPlanos = unstable_cache(
  async (): Promise<Plano[]> => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (error) {
      console.error('[getPlanos] erro:', error.message)
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
  },
  ['planos-list'],
  { revalidate: 3600, tags: ['planos'] }
)
