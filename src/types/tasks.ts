export interface TaskQuestion {
  id: string
  amount: number
  question: {
    question: string
    answerIndex: number
    answers: string[]
  }
}

export interface TaskTopic {
  topicId: string
  topicName: string
  questions: TaskQuestion[]
}

export interface Task {
  id: string
  categoryId: string
  categoryName: string
  categoryIcon: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  totalQuestions: number
  estimatedTimeMinutes: number
  totalReward: number
  topics: TaskTopic[]
}

export interface TaskCategory {
  id: string
  name: string
  icon: string
  description: string
  taskCount: number
  avgReward: number
}

export interface CompletedTask {
  id: string
  userId: string
  taskId: string
  completedAt: string
  score: number
  totalQuestions: number
  earned: number
  answers: Record<string, number>
}

export interface TaskSession {
  taskId: string
  userId: string
  currentQuestionIndex: number
  answers: Record<string, number>
  startedAt: string
  completedAt?: string
  earned?: number
}
