import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { QuizContainer } from '@/components/onboarding/quiz-container'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Configure sua conta' }

export default async function OnboardingPage() {
  const session = await getSession()

  if (!session) redirect('/login')
  if (session.empresaId) redirect('/dashboard')

  return <QuizContainer userId={session.userId} />
}
