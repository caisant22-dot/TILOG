'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitPesquisa } from '@/app/actions/pesquisa'
import { SuccessState } from './success-state'

const schema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  contato: z.string().min(5, 'Email ou WhatsApp obrigatório'),
  segmento: z.enum(['food_service', 'varejo', 'manutencao', 'servicos_gerais', 'outro'], {
    error: () => ({ message: 'Selecione um segmento' }),
  }),
  tamanho_empresa: z.enum(['solo', '2-5', '6-20', '20+']).optional(),
  maior_dor: z.string().min(10, 'Mínimo 10 caracteres').max(400),
  faixa_preco: z.enum(['nao_pagaria', 'ate_100', '101_200', '201_400', 'mais_400']).optional(),
  aceita_entrevista: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

const SEGMENTOS = [
  { value: 'food_service', label: 'Restaurante / Food Service' },
  { value: 'varejo', label: 'Varejo / Comércio' },
  { value: 'manutencao', label: 'Manutenção / Serviços Técnicos' },
  { value: 'servicos_gerais', label: 'Serviços Gerais' },
  { value: 'outro', label: 'Outro' },
]

const TAMANHOS = [
  { value: 'solo', label: 'Só eu' },
  { value: '2-5', label: '2–5 pessoas' },
  { value: '6-20', label: '6–20 pessoas' },
  { value: '20+', label: 'Mais de 20' },
]

const FAIXAS = [
  { value: 'nao_pagaria', label: 'Não pagaria' },
  { value: 'ate_100', label: 'Até R$ 100' },
  { value: '101_200', label: 'R$ 100–200' },
  { value: '201_400', label: 'R$ 200–400' },
  { value: 'mais_400', label: 'Mais de R$ 400' },
]

const slideIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

export function PesquisaForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { aceita_entrevista: false } })

  const maiorDorValue = watch('maior_dor') ?? ''
  const selectedTamanho = watch('tamanho_empresa')
  const selectedFaixa = watch('faixa_preco')
  const aceitaEntrevista = watch('aceita_entrevista')

  async function onSubmit(data: FormData) {
    setServerError('')
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.set(k, String(v))
    })
    fd.set('origem', 'landing')

    const result = await submitPesquisa(fd)
    if (result.success) {
      setSubmittedName(data.nome)
      setSubmitted(true)
    } else {
      setServerError(result.error)
    }
  }

  if (submitted) return <SuccessState nome={submittedName} />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1 — Nome */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.05 }}>
        <Input
          label="Seu nome"
          placeholder="Como podemos te chamar?"
          error={errors.nome?.message}
          {...register('nome')}
        />
      </motion.div>

      {/* 2 — Contato */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.1 }}>
        <Input
          label="Seu email ou WhatsApp"
          placeholder="email@empresa.com ou (31) 99999-9999"
          error={errors.contato?.message}
          {...register('contato')}
        />
      </motion.div>

      {/* 3 — Segmento */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.15 }}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">Tipo de negócio</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SEGMENTOS.map((s) => (
              <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={s.value} {...register('segmento')} className="sr-only" />
                <div
                  className={`flex-1 px-3 py-2 rounded-[var(--radius-md)] border text-sm transition-colors cursor-pointer ${
                    watch('segmento') === s.value
                      ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                      : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]'
                  }`}
                  onClick={() => setValue('segmento', s.value as FormData['segmento'])}
                >
                  {s.label}
                </div>
              </label>
            ))}
          </div>
          {errors.segmento && <p className="text-xs text-[var(--color-text-danger)]">{errors.segmento.message}</p>}
        </div>
      </motion.div>

      {/* 4 — Tamanho */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.2 }}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">Tamanho da equipe</label>
          <div className="flex flex-wrap gap-2">
            {TAMANHOS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setValue('tamanho_empresa', t.value as FormData['tamanho_empresa'])}
                className={`px-3 py-1.5 rounded-[var(--radius-md)] border text-sm transition-colors ${
                  selectedTamanho === t.value
                    ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 5 — Maior dor */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.25 }}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Qual é sua maior dificuldade hoje?
          </label>
          <textarea
            {...register('maior_dor')}
            placeholder="Ex: Fico perdido com o controle de estoque e não sei o quanto produzi no mês..."
            rows={4}
            maxLength={400}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] resize-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)]"
          />
          <div className="flex justify-between">
            {errors.maior_dor ? (
              <p className="text-xs text-[var(--color-text-danger)]">{errors.maior_dor.message}</p>
            ) : <span />}
            <p className="text-xs text-[var(--color-text-tertiary)]">{maiorDorValue.length}/400</p>
          </div>
        </div>
      </motion.div>

      {/* 6 — Faixa de preço */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.3 }}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Quanto pagaria por um sistema como o Tilog?
          </label>
          <div className="flex flex-wrap gap-2">
            {FAIXAS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setValue('faixa_preco', f.value as FormData['faixa_preco'])}
                className={`px-3 py-1.5 rounded-[var(--radius-md)] border text-sm transition-colors ${
                  selectedFaixa === f.value
                    ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7 — Aceita entrevista */}
      <motion.div {...slideIn} transition={{ ...slideIn.transition, delay: 0.35 }}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('aceita_entrevista')}
            className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-neutral-950)]"
          />
          <span className="text-sm text-[var(--color-text)]">
            Aceito receber contato para uma conversa de 15 minutos sobre como uso ferramentas hoje
          </span>
        </label>
      </motion.div>

      {serverError && (
        <p className="text-sm text-[var(--color-text-danger)]">{serverError}</p>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        Enviar resposta →
      </Button>
    </form>
  )
}
