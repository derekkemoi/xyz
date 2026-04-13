import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth-store"
import { STORAGE_KEYS } from "@/lib/constants"

import LandingPage from "@/pages/Landing"
import LoginPage from "@/pages/Login"
import SignupPage from "@/pages/Signup"
import AssessmentPage from "@/pages/Assessment"
import AssessmentResultPage from "@/pages/AssessmentResult"
import DashboardPage from "@/pages/Dashboard"
import PackagesPage from "@/pages/Packages"
import TasksPage from "@/pages/Tasks"
import TaskDetailPage from "@/pages/TaskDetail"
import EarningsPage from "@/pages/Earnings"
import WithdrawPage from "@/pages/Withdraw"
import ProfilePage from "@/pages/Profile"
import MPesaPage from "@/pages/MPesaPayment"
import PaystackPage from "@/pages/PaystackPayment"
import PaystackCallbackPage from "@/pages/PaystackCallback"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AssessmentRequiredRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const assessmentRaw = localStorage.getItem(STORAGE_KEYS.ASSESSMENT)
  let assessmentPassed = false
  if (assessmentRaw) {
    try {
      const assessment = JSON.parse(assessmentRaw)
      assessmentPassed = assessment.passed === true
    } catch {
      assessmentPassed = false
    }
  }

  if (!assessmentPassed) {
    return <Navigate to="/assessment" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <AssessmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/result"
          element={
            <ProtectedRoute>
              <AssessmentResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AssessmentRequiredRoute>
              <DashboardPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/packages"
          element={
            <AssessmentRequiredRoute>
              <PackagesPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <AssessmentRequiredRoute>
              <TasksPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <AssessmentRequiredRoute>
              <TaskDetailPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/earnings"
          element={
            <AssessmentRequiredRoute>
              <EarningsPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <AssessmentRequiredRoute>
              <WithdrawPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AssessmentRequiredRoute>
              <ProfilePage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/payments/mpesa"
          element={
            <AssessmentRequiredRoute>
              <MPesaPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/payments/paystack"
          element={
            <AssessmentRequiredRoute>
              <PaystackPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route
          path="/payments/paystack/callback"
          element={
            <AssessmentRequiredRoute>
              <PaystackCallbackPage />
            </AssessmentRequiredRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
