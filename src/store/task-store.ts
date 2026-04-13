import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CompletedTask } from "../types/tasks"
import { storage } from "../lib/storage"
import { STORAGE_KEYS } from "../lib/constants"
import { generateId } from "../lib/formatters"

interface TaskStore {
  completedTaskIds: Set<string>
  completedTasks: CompletedTask[]
  isTaskCompleted: (taskId: string) => boolean
  markTaskComplete: (
    userId: string,
    taskId: string,
    score: number,
    totalQuestions: number,
    earned: number,
    answers: Record<string, number>
  ) => void
  getCompletedTasks: () => CompletedTask[]
  clearCompletedTasks: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      completedTaskIds: new Set<string>(),
      completedTasks: [],

      isTaskCompleted: (taskId: string): boolean => {
        return get().completedTaskIds.has(taskId)
      },

      markTaskComplete: (
        userId: string,
        taskId: string,
        score: number,
        totalQuestions: number,
        earned: number,
        answers: Record<string, number>
      ) => {
        const completedTask: CompletedTask = {
          id: generateId(),
          userId,
          taskId,
          completedAt: new Date().toISOString(),
          score,
          totalQuestions,
          earned,
          answers,
        }

        set((state) => {
          const newIds = new Set(state.completedTaskIds)
          newIds.add(taskId)
          return {
            completedTaskIds: newIds,
            completedTasks: [completedTask, ...state.completedTasks],
          }
        })
      },

      getCompletedTasks: (): CompletedTask[] => {
        return get().completedTasks
      },

      clearCompletedTasks: () => {
        set({
          completedTaskIds: new Set<string>(),
          completedTasks: [],
        })
      },
    }),
    {
      name: STORAGE_KEYS.COMPLETED_TASKS,
      partialize: (state) => ({
        completedTasks: state.completedTasks,
        completedTaskIds: Array.from(state.completedTaskIds),
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        completedTaskIds: new Set(persistedState?.completedTaskIds || []),
      }),
    }
  )
)
