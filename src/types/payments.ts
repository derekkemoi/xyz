export type PaymentMethod = "M_PESA" | "PAYSTACK"
export type PaymentStatus = "pending" | "processing" | "successful" | "failed" | "abandoned"

export interface Payment {
  id: string
  userId: string
  packageId: string
  amount: number
  method: PaymentMethod
  reference: string
  status: PaymentStatus
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export interface PaymentConfig {
  paymentMethod: PaymentMethod
}

export interface InitPaymentRequest {
  email: string
  amount: number
  country: string
  channel: string
  callbackUrl: string
}

export interface InitPaymentResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface VerifyPaymentResponse {
  message: string
  reference: string
  email: string
  packageId: string | null
  status: PaymentStatus
}

export interface MPesaPaymentRequest {
  packageId: string
  phone: string
  amount: number
}
