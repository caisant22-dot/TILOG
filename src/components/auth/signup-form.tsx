'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getOnboardingSession, clearOnboardingSession } from '@/lib/onboarding/session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [answers, setAnswers] = useState<Record<string, string | string[] | null>>({})
  const [contextLoading, setContextLoading] = useState(true)

  useEffect(() => {
    const id = getOnboardingSession()
    if (!id) {
      router.replace('/onboarding')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(id)

    supabase
      .from('onboarding_responses')
      .select('company_name, business_type, raw_responses')
      .eq('session_id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCompanyName(data.company_name ?? '')
          setBusinessType(data.business_type ?? '')
          if (data.raw_responses && typeof data.raw_responses === 'object') {
            setAnswers(data.raw_responses as Record<string, string | string[] | null>)
          }
        }
        setContextLoading(false)
      })
  }, [supabase, router])

  function validatePassword(p: string): string | null {
    if (p.length < 8) return 'A senha precisa ter ao menos 8 caracteres.'
    if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) return 'Use letras e números para segurança.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const pwError = validatePassword(password)
    if (pwError) {
      setError(pwError)
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (!sessionId) {
      setError('Sua sessão expirou. Recomece o cadastro.')
      return
    }

    setLoading(true)

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    if (signupError) {
      setError(
        signupError.message.toLowerCase().includes('already')
          ? 'Esse email já está em uso. Tente entrar.'
          : 'Erro ao criar conta. Tente novamente.'
      )
      setLoading(false)
      return
    }

    if (!signupData.user) {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
      return
    }

    const { error: claimError } = await supabase.rpc('claim_onboarding_session', {
      p_session_id: sessionId,
      p_user_id: signupData.user.id,
    })
    if (claimError) console.error('[claim_onboarding_session]', claimError)

    if (signupData.session) {
      const { error: completeError } = await supabase.rpc('complete_onboarding', {
        p_user_id: signupData.user.id,
        p_business_type: businessType || 'outro',
        p_company_name: companyName || 'Minha Empresa',
        p_onboarding_answers: answers,
      })

      if (completeError) {
        console.error('[complete_onboarding]', completeError)
        setError('Conta criada, mas tivemos um problema ao configurar sua empresa. Faça login para tentar novamente.')
        setLoading(false)
        return
      }

      await supabase.auth.refreshSession()
      clearOnboardingSession()
      window.location.href = '/dashboard'
    } else {
      setLoading(false)
      router.push('/criar-conta/verifique-email?email=' + encodeURIComponent(email))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Quase lá!</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {contextLoading ? (
            'Carregando suas respostas...'
          ) : companyName ? (
            <>
              Crie sua conta para configurar{' '}
              <span className="font-medium text-[var(--color-text)]">{companyName}</span> no Tilog.
            </>
          ) : (
            'Crie sua conta para começar a usar o Tilog.'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Seu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@empresa.com"
          required
          autoFocus
          autoComplete="email"
        />
        <Input
          label="Crie uma senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          required
          autoComplete="new-password"
          hint="Use ao menos 8 caracteres com letras e números"
        />
        <Input
          label="Confirme sua senha"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Digite a senha de novo"
          required
          autoComplete="new-password"
        />

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border-danger)] bg-[var(--color-danger-light)]">
            <p className="text-sm text-[var(--color-text-danger)]">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Criar minha conta
        </Button>

        <p className="text-xs text-center text-[var(--color-text-tertiary)]">
          Ao criar conta você concorda com nossos termos de uso.
        </p>
      </form>

      <div className="text-center text-sm text-[var(--color-text-secondary)] pt-4 border-t border-[var(--color-border)]">
        Já tem conta?{' '}
        <Link href="/login" className="font-medium text-[var(--color-text)] underline underline-offset-2">
          Entrar
        </Link>
      </div>
    </div>
  )
}
