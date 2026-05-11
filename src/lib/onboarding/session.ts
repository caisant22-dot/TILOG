'use client'

const SESSION_KEY = 'tilog_onboarding_session_id'

export function getOrCreateOnboardingSession(): string {
  if (typeof window === 'undefined') return ''

  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function getOnboardingSession(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

export function clearOnboardingSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}
