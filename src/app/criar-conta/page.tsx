import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { SignupForm } from '@/components/auth/signup-form'

export default async function CriarContaPage() {
  const session = await getSession()
  if (session?.empresaId) redirect('/dashboard')

  return <SignupForm />
}
