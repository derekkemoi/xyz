export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}
