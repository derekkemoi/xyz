export type QuestionType =
  | "multiple_choice"
  | "arrange_words"
  | "classification"
  | "pattern"
  | "sentiment"

export interface AssessmentQuestion {
  id: string
  type: QuestionType
  prompt: string
  options?: string[]
  correctIndex?: number
  correctAnswer?: string
  imageUrl?: string
  sequence?: string[]
}

export interface AssessmentResult {
  assessmentId: string
  userId: string
  score: number
  totalQuestions: number
  passed: boolean
  completedAt: string
  answers: Record<string, number | string>
}

export interface OnboardingAssessment {
  id: string
  name: string
  description: string
  passPercentage: number
  questions: AssessmentQuestion[]
  estimatedDurationMinutes: number
}
