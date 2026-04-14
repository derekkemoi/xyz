import { API_URLS, TASKS_API_URL } from "./constants"
import type { Package } from "../types/package"
import type { PaymentConfig, InitPaymentResponse, VerifyPaymentResponse } from "../types/payments"
import type { Task } from "../types/tasks"

interface RemoteQuestion {
  id: string
  amount: number
  question: {
    question: string
    answerIndex: number
    answers: string[]
  }
}

interface RemoteTopic {
  topicId: string
  topicName: string
  questions: RemoteQuestion[]
}

interface RemoteCategory {
  categoryId: string
  categoryName: string
  topics: RemoteTopic[]
}

const DEFAULT_PACKAGES: Package[] = [
  {
    id: "beginner",
    name: "Beginner",
    description: "10 tasks/day • $0.50 – $1.20/task\nDaily: $8.00 • Monthly: $240",
    amount: 240,
    tier: "beginner",
    tasksPerDay: 10,
    pricePerTask: { min: 0.5, max: 1.2 },
    dailyEarnings: 8,
    monthlyEarnings: 240,
    benefits: ["10 tasks per day", "$0.50 - $1.20 per task", "Mobile & desktop access"],
  },
  {
    id: "average_skilled",
    name: "Average Skilled",
    description: "15 tasks/day • $1.20 – $2.80/task\nDaily: $22.00 • Monthly: $650",
    amount: 650,
    tier: "average_skilled",
    tasksPerDay: 15,
    pricePerTask: { min: 1.2, max: 2.8 },
    dailyEarnings: 22,
    monthlyEarnings: 650,
    benefits: ["15 tasks per day", "$1.20 - $2.80 per task", "Priority support"],
  },
  {
    id: "expert",
    name: "Expert",
    description: "25 tasks/day • $2.50 – $5.00/task\nDaily: $75.00 • Monthly: $2250",
    amount: 2250,
    tier: "expert",
    tasksPerDay: 25,
    pricePerTask: { min: 2.5, max: 5.0 },
    dailyEarnings: 75,
    monthlyEarnings: 2250,
    benefits: ["25 tasks per day", "$2.50 - $5.00 per task", "Priority support", "Advanced tasks"],
  },
  {
    id: "elite",
    name: "Elite",
    description: "40 tasks/day • $4.00 – $8.00/task\nDaily: $200.00 • Monthly: $6000",
    amount: 6000,
    tier: "elite",
    tasksPerDay: 40,
    pricePerTask: { min: 4.0, max: 8.0 },
    dailyEarnings: 200,
    monthlyEarnings: 6000,
    benefits: [
      "40 tasks per day",
      "$4.00 - $8.00 per task",
      "24/7 priority support",
      "Advanced & premium tasks",
      "Monthly bonus rewards",
    ],
  },
]

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  paymentMethod: "PAYSTACK",
}

export const fetchPackages = async (): Promise<Package[]> => {
  try {
    const response = await fetch(API_URLS.PACKAGES, { method: "GET" })
    if (!response.ok) throw new Error("Failed to fetch packages")
    return response.json()
  } catch (error) {
    console.warn("Failed to fetch packages from API, using defaults:", error)
    return DEFAULT_PACKAGES
  }
}

export const fetchPaymentConfig = async (): Promise<PaymentConfig> => {
  try {
    const response = await fetch(API_URLS.PAYMENT_CONFIG, { method: "GET" })
    if (!response.ok) throw new Error("Failed to fetch payment config")
    return response.json()
  } catch (error) {
    console.warn("Failed to fetch payment config, using default:", error)
    return DEFAULT_PAYMENT_CONFIG
  }
}

export const initPaystack = async (
  email: string,
  amount: number,
  callbackUrl: string
): Promise<InitPaymentResponse> => {
  const payload = {
    email,
    amount,
    country: "KE",
    channel: "mpesa",
    callbackUrl,
  }

  const response = await fetch(API_URLS.INIT_PAYMENT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error("Failed to initialize payment")
  return response.json()
}

export const verifyPayment = async (reference: string): Promise<VerifyPaymentResponse> => {
  const response = await fetch(`${API_URLS.VERIFY_PAYMENT}/${reference}`, {
    method: "GET",
  })

  if (!response.ok) throw new Error("Failed to verify payment")
  return response.json()
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(TASKS_API_URL)
  if (!response.ok) throw new Error("Failed to fetch tasks")
  const categories: RemoteCategory[] = await response.json()

  return categories.map((cat) => {
    const allQuestions = cat.topics.flatMap((t) => t.questions)
    const totalReward = allQuestions.reduce((sum, q) => sum + q.amount, 0)

    return {
      id: cat.categoryId,
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      categoryIcon: "LuZap",
      description: `${cat.categoryName} tasks`,
      difficulty: "easy" as const,
      totalQuestions: allQuestions.length,
      estimatedTimeMinutes: Math.max(3, Math.round(allQuestions.length * 0.5)),
      totalReward: Math.round(totalReward * 100) / 100,
      topics: cat.topics,
    }
  })
}
