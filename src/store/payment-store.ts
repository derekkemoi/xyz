import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Payment, PaymentStatus } from "../types/payments"
import { storage } from "../lib/storage"
import { STORAGE_KEYS } from "../lib/constants"
import { generateId } from "../lib/formatters"

interface PaymentStore {
  payments: Payment[]
  currentPaymentReference: string | null
  pendingPackageId: string | null
  addPayment: (
    userId: string,
    packageId: string,
    amount: number,
    method: string,
    reference: string
  ) => void
  updatePaymentStatus: (reference: string, status: PaymentStatus) => void
  setCurrentPayment: (reference: string, packageId: string) => void
  getCurrentPayment: () => Payment | null
  getPaymentByReference: (reference: string) => Payment | null
  clearCurrentPayment: () => void
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      payments: [],
      currentPaymentReference: null,
      pendingPackageId: null,

      addPayment: (
        userId: string,
        packageId: string,
        amount: number,
        method: string,
        reference: string
      ) => {
        const payment: Payment = {
          id: generateId(),
          userId,
          packageId,
          amount,
          method: method as "M_PESA" | "PAYSTACK",
          reference,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          payments: [payment, ...state.payments],
          currentPaymentReference: reference,
          pendingPackageId: packageId,
        }))
      },

      updatePaymentStatus: (reference: string, status: PaymentStatus) => {
        set((state) => ({
          payments: state.payments.map((p) =>
            p.reference === reference
              ? {
                  ...p,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      setCurrentPayment: (reference: string, packageId: string) => {
        set({
          currentPaymentReference: reference,
          pendingPackageId: packageId,
        })
      },

      getCurrentPayment: (): Payment | null => {
        const ref = get().currentPaymentReference
        if (!ref) return null
        return get().getPaymentByReference(ref)
      },

      getPaymentByReference: (reference: string): Payment | null => {
        return get().payments.find((p) => p.reference === reference) || null
      },

      clearCurrentPayment: () => {
        set({
          currentPaymentReference: null,
          pendingPackageId: null,
        })
      },
    }),
    {
      name: STORAGE_KEYS.PAYMENTS,
    }
  )
)
