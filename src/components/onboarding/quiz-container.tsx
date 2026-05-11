'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { QUIZ_QUESTIONS } from '@/lib/onboarding/quiz-questions'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateOnboardingSession } from '@/lib/onboarding/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { QuizQuestion } from './quiz-types'

const TOTAL_STEPS = 7

interface QuizContainerProps {
  userId: string | null
}

export function QuizContainer({ userId }: QuizContainerProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [textValue, setTextValue] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const supabase = createClient()

  // Inicializa session_id no client (apenas se anônimo). Empty deps = roda 1x após mount.
  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionId(getOrCreateOnboardingSession())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!userId && !sessionId) return

    async function restore() {
      const query = userId
        ? supabase.from('onboarding_responses').select('*').eq('user_id', userId).maybeSingle()
        : supabase.from('onboarding_responses').select('*').eq('session_id', sessionId!).maybeSingle()

      const { data } = await query
      if (!data) return

      if (data.current_step) setStep(Math.min(data.current_step, TOTAL_STEPS))
      if (data.raw_responses && typeof data.raw_responses === 'object') {
        setAnswers(data.raw_responses as Record<string, string | string[]>)
      }
    }
    restore()
  }, [userId, sessionId, supabase])

  const saveProgress = useCallback(
    async (newAnswers: Record<string, string | string[]>, currentStep: number) => {
      const payload = {
        current_step: currentStep,
        raw_responses: newAnswers,
        business_type: (newAnswers.business_type as string) ?? null,
        team_size: (newAnswers.team_size as string) ?? null,
        user_role_answer: (newAnswers.user_role as string) ?? null,
        main_challenge: (newAnswers.main_challenge as string) ?? null,
        current_tools: (newAnswers.current_tools as string[]) ?? null,
        primary_goal: (newAnswers.primary_goal as string) ?? null,
        company_name: (newAnswers.company_name as string) ?? null,
      }

      if (userId) {
        await supabase.from('onboarding_responses').upsert(
          { ...payload, user_id: userId },
          { onConflict: 'user_id' }
        )
      } else if (sessionId) {
        await supabase.from('onboarding_responses').upsert(
          { ...payload, session_id: sessionId },
          { onConflict: 'session_id' }
        )
      }
    },
    [userId, sessionId, supabase]
  )

  const finish = useCallback(
    async (finalAnswers: Record<string, string | string[]>) => {
      setRedirecting(true)
      await saveProgress(finalAnswers, TOTAL_STEPS)
      router.push('/criar-conta')
    },
    [router, saveProgress]
  )

  const handleSingleSelect = useCallback(
    async (questionId: string, value: string, autoAdvance: boolean) => {
      const newAnswers = { ...answers, [questionId]: value }
      setAnswers(newAnswers)

      if (step === TOTAL_STEPS) {
        await finish(newAnswers)
        return
      }

      const nextStep = step + 1
      await saveProgress(newAnswers, nextStep)
      if (autoAdvance) {
        setTimeout(() => setStep(nextStep), 400)
      } else {
        setStep(nextStep)
      }
    },
    [answers, step, saveProgress, finish]
  )

  const handleMultiToggle = useCallback(
    (questionId: string, value: string) => {
      const current = (answers[questionId] as string[]) ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      setAnswers((prev) => ({ ...prev, [questionId]: next }))
    },
    [answers]
  )

  const handleContinue = useCallback(async () => {
    const q = QUIZ_QUESTIONS[step - 1]
    if (!q) return

    let newAnswers = answers
    if (q.type === 'text') {
      newAnswers = { ...answers, [q.id]: textValue }
      setAnswers(newAnswers)
    }

    if (step === TOTAL_STEPS) {
      await finish(newAnswers)
      return
    }

    await saveProgress(newAnswers, step + 1)
    setTextValue('')
    setStep((s) => s + 1)
  }, [answers, step, textValue, saveProgress, finish])

  const progress = (step / TOTAL_STEPS) * 100

  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 animate-fade-in">
        <div className="w-8 h-8 border-2 border-[var(--color-neutral-200)] border-t-[var(--color-neutral-950)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-secondary)]">Quase lá... preparando seu cadastro.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <div className="w-full h-1 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-neutral-950)] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
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
          isLast={step === TOTAL_STEPS}
        />
      </AnimatePresence>

      <p className="text-center text-xs text-[var(--color-text-tertiary)]">
        {step} de {TOTAL_STEPS} • Suas respostas são salvas automaticamente
      </p>
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
  isLast,
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
  isLast: boolean
}) {
  if (!question) return null

  const selected = answers[question.id]

  const canContinue =
    question.type === 'text'
      ? textValue.trim().length > 0
      : question.type === 'multi_select'
      ? question.skippable || (Array.isArray(selected) && selected.length > 0)
      : !!selected

  const continueLabel = isLast ? 'Criar minha conta →' : 'Continuar'

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
          <Button onClick={onContinue} disabled={!canContinue} className="flex-1">
            {continueLabel}
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
