import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../types/auth"
import { STORAGE_KEYS } from "../lib/constants"
import { generateId } from "../lib/formatters"

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => void
  signup: (email: string, password: string, name: string) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const currentUser = get().user

          if (currentUser && currentUser.email === email) {
            set({
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              isLoading: false,
              error: "Invalid email or password",
            })
          }
        } catch (error) {
          set({
            isLoading: false,
            error: "Login failed",
          })
        }
      },

      signup: (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          const currentUser = get().user

          if (currentUser) {
            set({
              isLoading: false,
              error: "An account already exists. Please log in.",
            })
            return
          }

          const newUser: User = {
            id: generateId(),
            email,
            name,
            createdAt: new Date().toISOString(),
          }

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            isLoading: false,
            error: "Signup failed",
          })
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
