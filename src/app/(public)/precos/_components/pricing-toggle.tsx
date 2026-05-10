'use client'

import { useState, createContext, useContext } from 'react'

const PricingContext = createContext<{ isAnual: boolean; setIsAnual: (v: boolean) => void }>({
  isAnual: false,
  setIsAnual: () => {},
})

export function usePricing() {
  return useContext(PricingContext)
}

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [isAnual, setIsAnual] = useState(false)
  return (
    <PricingContext.Provider value={{ isAnual, setIsAnual }}>
      {children}
    </PricingContext.Provider>
  )
}

export function PricingToggle() {
  const { isAnual, setIsAnual } = usePricing()

  return (
    <div className="flex items-center gap-3 justify-center">
      <span className={`text-sm ${!isAnual ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
        Mensal
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isAnual}
        onClick={() => setIsAnual(!isAnual)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] ${
          isAnual ? 'bg-[var(--color-neutral-950)]' : 'bg-[var(--color-neutral-300)]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAnual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm flex items-center gap-1.5 ${isAnual ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
        Anual
        {isAnual && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-success-light)] text-[var(--color-text-success)] border border-[var(--color-border-success)]">
            2 meses grátis
          </span>
        )}
      </span>
    </div>
  )
}
