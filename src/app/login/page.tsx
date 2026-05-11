'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-raised)] p-4">
      <Link
        href="/"
        className="fixed top-4 left-4 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        ← Voltar para o site
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Tilog</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoFocus
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-[var(--color-text-danger)]">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>

          <div className="text-center">
            <Link
              href="/recuperar-senha"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] underline underline-offset-2"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>

        <div className="text-center text-sm text-[var(--color-text-secondary)] pt-4 border-t border-[var(--color-border)]">
          Ainda não tem conta?{' '}
          <Link
            href="/onboarding"
            className="font-medium text-[var(--color-text)] underline underline-offset-2"
          >
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  )
}
