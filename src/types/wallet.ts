export interface Wallet {
  userId: string
  balance: number
  welcomeBonusAwarded: boolean
  welcomeBonusAmount: number
}

export interface EarningsEntry {
  id: string
  userId: string
  amount: number
  source: "task" | "welcome_bonus" | "refund"
  taskId?: string
  createdAt: string
  description: string
}

export interface Withdrawal {
  id: string
  userId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  requestedAt: string
  completedAt?: string
  method: string
  reference?: string
}

export interface WalletState {
  balance: number
  welcomeBonusAwarded: boolean
  earnings: EarningsEntry[]
  withdrawals: Withdrawal[]
}
