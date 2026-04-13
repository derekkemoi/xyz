import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WalletState, EarningsEntry, Withdrawal } from "../types/wallet"
import { storage } from "../lib/storage"
import { STORAGE_KEYS, WELCOME_BONUS_AMOUNT } from "../lib/constants"
import { generateId } from "../lib/formatters"

interface WalletStore extends WalletState {
  addEarnings: (amount: number, source: string, taskId?: string, description?: string) => void
  awardWelcomeBonus: (userId: string) => boolean
  addWithdrawal: (userId: string, amount: number, method: string) => void
  getWithdrawals: () => Withdrawal[]
  getEarnings: () => EarningsEntry[]
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: 0,
      welcomeBonusAwarded: false,
      earnings: [],
      withdrawals: [],

      addEarnings: (amount: number, source: string, taskId?: string, description?: string) => {
        const entry: EarningsEntry = {
          id: generateId(),
          userId: "current-user",
          amount,
          source: source as "task" | "welcome_bonus" | "refund",
          taskId,
          createdAt: new Date().toISOString(),
          description: description || source,
        }

        set((state) => ({
          balance: state.balance + amount,
          earnings: [entry, ...state.earnings],
        }))
      },

      awardWelcomeBonus: (userId: string): boolean => {
        const state = get()

        if (state.welcomeBonusAwarded) {
          return false
        }

        set((state) => ({
          balance: state.balance + WELCOME_BONUS_AMOUNT,
          welcomeBonusAwarded: true,
          earnings: [
            {
              id: generateId(),
              userId,
              amount: WELCOME_BONUS_AMOUNT,
              source: "welcome_bonus",
              createdAt: new Date().toISOString(),
              description: "Welcome Bonus",
            },
            ...state.earnings,
          ],
        }))

        return true
      },

      addWithdrawal: (userId: string, amount: number, method: string) => {
        const withdrawal: Withdrawal = {
          id: generateId(),
          userId,
          amount,
          method,
          status: "pending",
          requestedAt: new Date().toISOString(),
        }

        set((state) => ({
          withdrawals: [withdrawal, ...state.withdrawals],
        }))
      },

      getWithdrawals: (): Withdrawal[] => {
        return get().withdrawals
      },

      getEarnings: (): EarningsEntry[] => {
        return get().earnings
      },
    }),
    {
      name: STORAGE_KEYS.WALLET,
    }
  )
)
