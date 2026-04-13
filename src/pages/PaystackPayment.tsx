import { useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Spinner,
} from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { LuArrowLeft, LuCreditCard, LuShield, LuZap } from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import type { Package } from "@/types/package"
import { useAuthStore } from "@/store/auth-store"
import { usePaymentStore } from "@/store/payment-store"
import { initPaystack } from "@/lib/api"
import { toaster } from "@/components/ui/toaster"
import { formatCurrency } from "@/lib/formatters"
import { Alert } from "@/components/ui/alert"

export default function PaystackPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { addPayment, setCurrentPayment } = usePaymentStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pkg: Package | null = location.state?.package || null

  if (!pkg) {
    return (
      <AppShell>
        <Box textAlign="center" py="16">
          <Text color="fg.muted">No package selected. Please go back and choose a package.</Text>
          <Button mt="4" colorPalette="green" onClick={() => navigate("/packages")}>
            View Packages
          </Button>
        </Box>
      </AppShell>
    )
  }

  const amountKobo = pkg.amount * 100 * 130 // Convert to KES kobo

  const handlePay = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)

    try {
      const callbackUrl = `${window.location.origin}/payments/paystack/callback`
      const response = await initPaystack(user.email, amountKobo, callbackUrl)

      if (!response.status) {
        throw new Error(response.message || "Payment initialization failed")
      }

      const { authorization_url, reference } = response.data

      addPayment(user.id, pkg.id, pkg.amount, "PAYSTACK", reference)
      setCurrentPayment(reference, pkg.id)

      window.location.href = authorization_url
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to initialize payment"
      setError(message)
      toaster.create({
        title: "Payment Error",
        description: message,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch" maxW="480px" mx="auto">
        {/* Header */}
        <HStack gap="3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/packages")} px="2">
            <LuArrowLeft />
            Back
          </Button>
          <Box>
            <Heading size="lg" color="fg">Paystack Payment</Heading>
            <Text fontSize="sm" color="fg.muted">Secure online payment</Text>
          </Box>
        </HStack>

        {/* Package Summary */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="green.500/30"
          p="6"
          background="linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 70%)"
        >
          <HStack justify="space-between" wrap="wrap" gap="4">
            <VStack align="start" gap="1">
              <Badge colorPalette="green" variant="subtle">Selected Package</Badge>
              <Heading size="xl" color="fg">{pkg.name}</Heading>
              <Text color="fg.muted" fontSize="sm">
                {pkg.tasksPerDay} tasks/day • {formatCurrency(pkg.dailyEarnings)}/day earnings
              </Text>
            </VStack>
            <VStack align="end" gap="1">
              <Text fontSize="sm" color="fg.muted">Amount</Text>
              <Text fontSize="3xl" fontWeight="extrabold" color="green.400">
                {formatCurrency(pkg.amount)}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Payment Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="6"
        >
          <VStack gap="5">
            <Box
              w="14"
              h="14"
              borderRadius="2xl"
              bg="green.500/15"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="green.400"
            >
              <LuCreditCard size={28} />
            </Box>
            <VStack gap="1" textAlign="center">
              <Text fontWeight="bold" color="fg" fontSize="lg">Pay with Paystack</Text>
              <Text color="fg.muted" fontSize="sm">
                You'll be securely redirected to Paystack's payment page to complete your purchase.
              </Text>
            </VStack>

            {error && (
              <Alert status="error" title="Payment Failed">
                {error}
              </Alert>
            )}

            <HStack gap="4" w="full" justify="center">
              {["VISA", "Mastercard", "M-PESA", "Airtel"].map((method) => (
                <Box
                  key={method}
                  bg="bg.subtle"
                  border="1px solid"
                  borderColor="border"
                  borderRadius="md"
                  px="2"
                  py="1"
                >
                  <Text fontSize="xs" color="fg.muted" fontWeight="medium">{method}</Text>
                </Box>
              ))}
            </HStack>

            <Button
              colorPalette="green"
              size="lg"
              w="full"
              onClick={handlePay}
              loading={isLoading}
              loadingText="Redirecting to Paystack..."
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <LuZap />
                  Pay {formatCurrency(pkg.amount)} with Paystack
                </>
              )}
            </Button>

            <HStack gap="2" justify="center">
              <Box color="fg.muted">
                <LuShield size={14} />
              </Box>
              <Text fontSize="xs" color="fg.muted">
                Secured by Paystack. 256-bit SSL encryption.
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </AppShell>
  )
}
