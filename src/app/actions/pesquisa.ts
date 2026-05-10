'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'

const PesquisaSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório').max(100),
  contato: z.string().min(5, 'Email ou WhatsApp obrigatório').max(150),
  segmento: z.enum(['food_service', 'varejo', 'manutencao', 'servicos_gerais', 'outro']),
  tamanho_empresa: z.enum(['solo', '2-5', '6-20', '20+']).optional(),
  maior_dor: z.string().min(10, 'Descreva sua maior dificuldade').max(500),
  faixa_preco: z.enum(['nao_pagaria', 'ate_100', '101_200', '201_400', 'mais_400']).optional(),
  aceita_entrevista: z.boolean().default(false),
  origem: z.enum(['landing', 'quiz', 'link_direto']).default('landing'),
})

type SubmitResult =
  | { success: true; duplicate?: boolean }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitPesquisa(formData: FormData): Promise<SubmitResult> {
  const cookieStore = await cookies()
  const rateCookie = cookieStore.get('pesquisa_rate')

  if (rateCookie) {
    try {
      const { count, resetAt } = JSON.parse(rateCookie.value) as { count: number; resetAt: number }
      if (Date.now() < resetAt && count >= 3) {
        return { success: false, error: 'Muitas tentativas. Tente novamente em 1 hora.' }
      }
    } catch {}
  }

  const raw = Object.fromEntries(formData.entries())
  const parsed = PesquisaSchema.safeParse({
    ...raw,
    aceita_entrevista: raw.aceita_entrevista === 'true',
  })

  if (!parsed.success) {
    return {
      success: false,
      error: 'Dados inválidos. Verifique os campos.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const data = parsed.data
  const supabase = await createClient()

  const isEmail = data.contato.includes('@')
  const email = isEmail
    ? data.contato
    : `whatsapp_${data.contato.replace(/\D/g, '')}@tilog.app`
  const whatsapp = !isEmail ? data.contato : null

  // Deduplicação: mesmo email em 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('pesquisa_leads')
    .select('id')
    .eq('email', email)
    .gte('created_at', oneDayAgo)
    .limit(1)
    .single()

  if (existing) return { success: true, duplicate: true }

  const session = await getSession()
  const empresa_id = session?.empresaId ?? null

  const { error: insertError } = await supabase.from('pesquisa_leads').insert({
    empresa_id,
    nome: data.nome,
    email,
    whatsapp,
    segmento: data.segmento,
    tamanho_empresa: data.tamanho_empresa ?? null,
    maior_dor: data.maior_dor,
    faixa_preco: data.faixa_preco ?? null,
    aceita_entrevista: data.aceita_entrevista,
    origem: data.origem,
  })

  if (insertError) {
    console.error('[submitPesquisa] erro:', insertError.message)
    return { success: false, error: 'Erro ao salvar. Tente novamente.' }
  }

  // Atualizar rate limit cookie
  let newCount = 1
  let resetAt = Date.now() + 60 * 60 * 1000

  if (rateCookie) {
    try {
      const existing_rate = JSON.parse(rateCookie.value) as { count: number; resetAt: number }
      if (Date.now() < existing_rate.resetAt) {
        newCount = existing_rate.count + 1
        resetAt = existing_rate.resetAt
      }
    } catch {}
  }

  cookieStore.set('pesquisa_rate', JSON.stringify({ count: newCount, resetAt }), {
    httpOnly: true,
    maxAge: 3600,
    path: '/',
  })

  return { success: true }
}
