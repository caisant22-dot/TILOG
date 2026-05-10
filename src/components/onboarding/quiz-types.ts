export type QuestionType = 'single_select' | 'multi_select' | 'text'

export interface QuizOption {
  value: string
  label: string
  icon?: string
}

export interface QuizQuestion {
  id: string
  step: number
  type: QuestionType
  question: string
  subtitle?: string
  options?: QuizOption[]
  placeholder?: string
  skippable?: boolean
  autoAdvance?: boolean
}

export interface QuizState {
  currentStep: number
  answers: Record<string, string | string[]>
  isCompleting: boolean
  isCompleted: boolean
}
