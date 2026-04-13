export interface Package {
  id: string
  name: string
  description: string
  amount: number
  tier: "beginner" | "average_skilled" | "expert" | "elite"
  tasksPerDay: number
  pricePerTask: {
    min: number
    max: number
  }
  dailyEarnings: number
  monthlyEarnings: number
  benefits?: string[]
}

export interface Subscription {
  id: string
  userId: string
  packageId: string
  startDate: string
  endDate?: string
  isActive: boolean
  auto_renew: boolean
}

export interface PackageActivationRequest {
  packageId: string
  userId: string
  timestamp: string
}
