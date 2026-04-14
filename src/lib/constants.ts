export const APP_NAME = "Remotask"
export const WELCOME_BONUS_AMOUNT = 10

export const STORAGE_KEYS = {
  USER: "remotask_user",
  ASSESSMENT: "remotask_assessment",
  WALLET: "remotask_wallet",
  SUBSCRIPTION: "remotask_subscription",
  PAYMENTS: "remotask_payments",
  COMPLETED_TASKS: "remotask_completed_tasks",
  WITHDRAWALS: "remotask_withdrawals",
  PAYMENT_REFERENCE: "remotask_payment_reference",
}

export const API_URLS = {
  PACKAGES: "https://derekkemoi.github.io/Remo/packages.json",
  PAYMENT_CONFIG: "https://your-api.example.com/payment-config",
  INIT_PAYMENT: "https://wmvevoiuxwbskzqefzmd.supabase.co/functions/v1/init-payment",
  VERIFY_PAYMENT: "https://wmvevoiuxwbskzqefzmd.supabase.co/functions/v1/verify-payment",
}

export const MPESA_TILL_NAME = "CV WRITTING GARAGE"
export const TASKS_API_URL = "https://derekkemoi.github.io/Remo/tasks.json"

export const ASSESSMENT_PASS_PERCENTAGE = 60
export const ASSESSMENT_TOTAL_QUESTIONS = 5

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ASSESSMENT: "/assessment",
  ASSESSMENT_RESULT: "/assessment/result",
  DASHBOARD: "/dashboard",
  PACKAGES: "/packages",
  TASKS: "/tasks",
  TASK_DETAIL: "/tasks/:taskId",
  EARNINGS: "/earnings",
  WITHDRAW: "/withdraw",
  PROFILE: "/profile",
  PAYMENTS: {
    MPESA: "/payments/mpesa",
    PAYSTACK: "/payments/paystack",
    PAYSTACK_CALLBACK: "/payments/paystack/callback",
  },
}

export const TASK_CATEGORIES = [
  "Text Annotation",
  "Data Categorization",
  "Pattern Recognition",
  "Sentiment Analysis",
  "Survey Validation",
  "Image Labeling",
  "Content Classification",
  "Translation Review",
  "Audio Transcription Review",
  "Research Data Collection",
]
