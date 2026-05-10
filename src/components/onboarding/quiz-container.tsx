'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { QUIZ_QUESTIONS } from '@/lib/onboarding/quiz-questions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { QuizQuestion } from './quiz-types'
import { submitPesquisa } from '@/app/actions/pesquisa'

const TOTAL_STEPS = 8

interface QuizContainerProps {
  userId: string
}

export function QuizContainer({ userId }: QuizContainerProps) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [completionError, setCompletionError] = useState<string | null>(null)

  // Step 8 state
  const [maiorDor, setMaiorDor] = useState('')
  const [ferramentasAtuais, setFerramentasAtuais] = useState<string[]>([])
  const [aceitaEntrevista, setAceitaEntrevista] = useState(false)
  const [sendingStep8, setSendingStep8] = useState(false)

  const supabase = createClient()

  // Restore progress
  useEffect(() => {
    async function restore() {
      const { data } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!data) return

      if (data.is_completed) {
        await supabase.auth.refreshSession()
        window.location.href = '/dashboard'
        return
      }

      if (data.current_step) setStep(data.current_step)
      if (data.raw_responses && typeof data.raw_responses === 'object') {
        setAnswers(data.raw_responses as Record<string, string | string[]>)
      }
    }
    restore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const saveProgress = useCallback(
    async (newAnswers: Record<string, string | string[]>, currentStep: number) => {
      await supabase.from('onboarding_responses').upsert({
        user_id: userId,
        current_step: currentStep,
        raw_responses: newAnswers,
        business_type: (newAnswers.business_type as string) ?? null,
        team_size: (newAnswers.team_size as string) ?? null,
        user_role_answer: (newAnswers.user_role as string) ?? null,
        main_challenge: (newAnswers.main_challenge as string) ?? null,
        current_tools: (newAnswers.current_tools as string[]) ?? null,
        primary_goal: (newAnswers.primary_goal as string) ?? null,
        company_name: (newAnswers.company_name as string) ?? null,
      }, { onConflict: 'user_id' })
    },
    [userId, supabase]
  )

  const handleSingleSelect = useCallback(
    async (questionId: string, value: string, autoAdvance: boolean) => {
      const newAnswers = { ...answers, [questionId]: value }
      setAnswers(newAnswers)
      const nextStep = step + 1
      await saveProgress(newAnswers, nextStep)
      if (autoAdvance) {
        setTimeout(() => setStep(nextStep), 400)
      } else {
        setStep(nextStep)
      }
    },
    [answers, step, saveProgress]
  )

  const handleMultiToggle = useCallback(
    (questionId: string, value: string) => {
      const current = (answers[questionId] as string[]) ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      setAnswers((prev) => ({ ...prev, [questionId]: next }))
    },
    [answers]
  )

  const handleContinue = useCallback(async () => {
    const q = QUIZ_QUESTIONS[step - 1]
    if (!q) return

    if (q.type === 'text') {
      const newAnswers = { ...answers, [q.id]: textValue }
      setAnswers(newAnswers)
      await saveProgress(newAnswers, step + 1)
    } else {
      await saveProgress(answers, step + 1)
    }
    setTextValue('')
    setStep((s) => s + 1)
  }, [answers, step, textValue, saveProgress])

  async function completeOnboarding() {
    setIsCompleting(true)
    setCompletionError(null)
    try {
      const { data, error } = await supabase.rpc('complete_onboarding', {
        p_user_id: userId,
        p_business_type: (answers.business_type as string) ?? 'outro',
        p_company_name: (answers.company_name as string) ?? 'Minha Empresa',
        p_onboarding_answers: answers,
      })

      if (error) {
        console.error('[complete_onboarding] RPC error:', error)
        setCompletionError(`Erro ao criar sua empresa: ${error.message}. Recarregue a página e tente novamente.`)
        setIsCompleting(false)
        return
      }

      console.log('[complete_onboarding] sucesso:', data)

      // Retry refreshSession para o hook reemitir JWT com empresa_id
      let refreshed = false
      for (let i = 0; i < 3 && !refreshed; i++) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)))
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (!refreshError) refreshed = true
        else console.warn('[refreshSession] tentativa', i + 1, refreshError)
      }

      if (!refreshed) {
        setCompletionError('Empresa criada, mas houve um problema ao atualizar sua sessão.')
        setIsCompleting(false)
        return
      }

      setIsCompleted(true)
      setTimeout(() => { window.location.href = '/dashboard' }, 2500)
    } catch (err) {
      console.error('[complete_onboarding] exception:', err)
      setCompletionError('Erro inesperado ao concluir. Tente novamente.')
      setIsCompleting(false)
    }
  }

  async function handleStep8Submit(skip: boolean) {
    setSendingStep8(true)
    if (!skip && maiorDor.trim().length >= 10) {
      const fd = new FormData()
      fd.set('nome', (answers.company_name as string) ?? 'Usuário')
      fd.set('contato', userId + '@tilog.app')
      fd.set('segmento', (answers.business_type as string) ?? 'outro')
      fd.set('maior_dor', maiorDor)
      fd.set('aceita_entrevista', String(aceitaEntrevista))
      fd.set('origem', 'quiz')
      await submitPesquisa(fd)
    }
    await completeOnboarding()
  }

  // Completion screen
  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 animate-fade-in">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" className="text-[var(--color-neutral-200)]" />
            <path
              d="M18 32 L27 42 L46 22"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-success)] animate-[scaleIn_0.4s_ease-out_both]"
            />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Tudo pronto!</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Preparando seu painel...</p>
        </div>
      </div>
    )
  }

  const progress = ((step - 1) / TOTAL_STEPS) * 100

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Progress bar */}
      <div className="w-full h-1 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-neutral-950)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {completionError && (
        <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border-danger)] bg-[var(--color-danger-light)] text-sm text-[var(--color-text-danger)] space-y-2">
          <p>{completionError}</p>
          <button
            onClick={() => { window.location.href = '/dashboard' }}
            className="underline text-xs"
            type="button"
          >
            Tentar acessar o dashboard mesmo assim →
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step <= 7 ? (
          <QuizStep
            key={step}
            question={QUIZ_QUESTIONS[step - 1]}
            answers={answers}
            textValue={textValue}
            onTextChange={setTextValue}
            onSingleSelect={handleSingleSelect}
            onMultiToggle={handleMultiToggle}
            onContinue={handleContinue}
            onBack={() => setStep((s) => Math.max(1, s - 1))}
            isFirst={step === 1}
          />
        ) : (
          // Step 8 — pesquisa opcional
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Nos ajude a melhorar</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-neutral-100)] text-[var(--color-text-tertiary)]">(opcional)</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">Leva menos de 1 minuto. Sua opinião vai direto para o time de produto.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text)]">Qual é sua maior dificuldade hoje?</label>
                <textarea
                  value={maiorDor}
                  onChange={(e) => setMaiorDor(e.target.value.slice(0, 400))}
                  placeholder="Ex: Fico perdido com o controle de estoque..."
                  rows={3}
                  className="mt-1.5 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] resize-none"
                />
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1 text-right">{maiorDor.length}/400</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-text)]">O que você usa atualmente?</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {['Planilha', 'WhatsApp', 'Nenhum sistema', 'Outro'].map((tool) => {
                    const val = tool.toLowerCase().replace(/\s+/g, '_')
                    const sel = ferramentasAtuais.includes(val)
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFerramentasAtuais((prev) =>
                          sel ? prev.filter((v) => v !== val) : [...prev, val]
                        )}
                        className={`px-3 py-1.5 rounded-[var(--radius-md)] text-sm border transition-colors ${
                          sel
                            ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)]'
                        }`}
                      >
                        {tool}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setAceitaEntrevista((v) => !v)}
                  className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${aceitaEntrevista ? 'bg-[var(--color-neutral-950)]' : 'bg-[var(--color-neutral-300)]'}`}
                >
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-[left] ${aceitaEntrevista ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-sm text-[var(--color-text)]">Posso te ligar para uma conversa rápida de 15 minutos</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleStep8Submit(true)}
                loading={sendingStep8}
                className="flex-1"
              >
                Pular e entrar
              </Button>
              <Button
                onClick={() => handleStep8Submit(false)}
                loading={sendingStep8}
                className="flex-1"
                disabled={maiorDor.trim().length < 10}
              >
                Enviar e entrar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function QuizStep({
  question,
  answers,
  textValue,
  onTextChange,
  onSingleSelect,
  onMultiToggle,
  onContinue,
  onBack,
  isFirst,
}: {
  question: QuizQuestion
  answers: Record<string, string | string[]>
  textValue: string
  onTextChange: (v: string) => void
  onSingleSelect: (id: string, value: string, auto: boolean) => void
  onMultiToggle: (id: string, value: string) => void
  onContinue: () => void
  onBack: () => void
  isFirst: boolean
}) {
  if (!question) return null

  const selected = answers[question.id]

  const canContinue =
    question.type === 'text'
      ? textValue.trim().length > 0
      : question.type === 'multi_select'
      ? question.skippable || (Array.isArray(selected) && selected.length > 0)
      : !!selected

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{question.subtitle}</p>
        )}
      </div>

      {question.type === 'text' && (
        <Input
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={question.placeholder}
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && canContinue && onContinue()}
        />
      )}

      {question.type === 'single_select' && question.options && (
        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSingleSelect(question.id, opt.value, question.autoAdvance ?? false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] border text-sm text-left transition-colors ${
                  isSelected
                    ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                    : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'multi_select' && question.options && (
        <div className="grid grid-cols-1 gap-2">
          {question.options.map((opt) => {
            const sel = Array.isArray(selected) && selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onMultiToggle(question.id, opt.value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] border text-sm text-left transition-colors ${
                  sel
                    ? 'bg-[var(--color-neutral-950)] text-[var(--color-neutral-0)] border-[var(--color-neutral-950)]'
                    : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-neutral-50)]'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {!isFirst && (
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        {(question.type !== 'single_select' || !question.autoAdvance) && (
          <Button
            onClick={onContinue}
            disabled={!canContinue}
            className="flex-1"
          >
            {question.step === 7 ? 'Finalizar e entrar' : 'Continuar'}
          </Button>
        )}
        {question.skippable && question.type !== 'text' && (
          <Button variant="ghost" onClick={onContinue} className="text-[var(--color-text-secondary)]">
            Pular
          </Button>
        )}
      </div>
    </motion.div>
  )
}
