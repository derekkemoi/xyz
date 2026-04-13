import { STORAGE_KEYS } from "./constants"

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from storage key ${key}:`, error)
    return defaultValue
  }
}

const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to storage key ${key}:`, error)
  }
}

const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from storage key ${key}:`, error)
  }
}

const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Error clearing storage:", error)
  }
}

export const storage = {
  get: getFromStorage,
  set: setToStorage,
  remove: removeFromStorage,
  clear: clearStorage,
}
