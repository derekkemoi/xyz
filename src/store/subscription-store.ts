import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Package, Subscription } from "../types/package"
import { storage } from "../lib/storage"
import { STORAGE_KEYS } from "../lib/constants"
import { generateId } from "../lib/formatters"

interface SubscriptionStore {
  activePackage: Package | null
  subscription: Subscription | null
  setActivePackage: (pkg: Package, userId: string) => void
  getActivePackage: () => Package | null
  clearActivePackage: () => void
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      activePackage: null,
      subscription: null,

      setActivePackage: (pkg: Package, userId: string) => {
        const subscription: Subscription = {
          id: generateId(),
          userId,
          packageId: pkg.id,
          startDate: new Date().toISOString(),
          isActive: true,
          auto_renew: true,
        }

        set({
          activePackage: pkg,
          subscription,
        })
      },

      getActivePackage: (): Package | null => {
        return get().activePackage
      },

      clearActivePackage: () => {
        set({
          activePackage: null,
          subscription: null,
        })
      },
    }),
    {
      name: STORAGE_KEYS.SUBSCRIPTION,
    }
  )
)
