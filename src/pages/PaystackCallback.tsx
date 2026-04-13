import { useEffect, useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Spinner,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { LuCircleCheck, LuCircleX, LuCircleAlert, LuRefreshCw } from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useAuthStore } from "@/store/auth-store"
import { usePaymentStore } from "@/store/payment-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useWalletStore } from "@/store/wallet-store"
import { verifyPayment, fetchPackages } from "@/lib/api"
import { toaster } from "@/components/ui/toaster"
import type { PaymentStatus } from "@/types/payments"

type VerifyState = "loading" | "success" | "failed" | "abandoned" | "error"

export default function PaystackCallbackPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentPaymentReference, pendingPackageId, updatePaymentStatus, clearCurrentPayment } = usePaymentStore()
  const { setActivePackage } = useSubscriptionStore()
  const { awardWelcomeBonus } = useWalletStore()
  const [state, setState] = useState<VerifyState>("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const verify = async () => {
      if (!currentPaymentReference) {
        setState("error")
        setErrorMessage("No payment reference found. Please try again.")
        return
      }

      try {
        const result = await verifyPayment(currentPaymentReference)

        if (result.status === "successful") {
          updatePaymentStatus(currentPaymentReference, "successful")

          if (user && pendingPackageId) {
            const packages = await fetchPackages()
            const pkg = packages.find((p) => p.id === pendingPackageId)
            if (pkg) {
              setActivePackage(pkg, user.id)
            }

            awardWelcomeBonus(user.id)
          }

          clearCurrentPayment()
          setState("success")

          toaster.create({
            title: "Payment Successful!",
            description: "Your package is now active. Happy earning!",
            type: "success",
          })

          setTimeout(() => {
            navigate("/dashboard")
          }, 3000)
        } else if (result.status === "abandoned") {
          updatePaymentStatus(currentPaymentReference, "abandoned")
          setState("abandoned")
        } else {
          updatePaymentStatus(currentPaymentReference, "failed")
          setState("failed")
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Verification failed"
        setErrorMessage(msg)
        setState("error")
      }
    }

    verify()
  }, [])

  const handleRetry = () => {
    clearCurrentPayment()
    navigate("/packages")
  }

  return (
    <AppShell>
      <Box display="flex" alignItems="center" justifyContent="center" minH="60vh">
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p={{ base: "6", md: "10" }}
          w="full"
          maxW="440px"
          textAlign="center"
        >
          {state === "loading" && (
            <VStack gap="6">
              <Spinner size="xl" color="green.400" />
              <VStack gap="2">
                <Heading size="lg" color="fg">Verifying Payment</Heading>
                <Text color="fg.muted">Please wait while we confirm your payment...</Text>
              </VStack>
            </VStack>
          )}

          {state === "success" && (
            <VStack gap="6">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="green.500/15"
                border="2px solid"
                borderColor="green.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.400"
              >
                <LuCircleCheck size={40} />
              </Box>
              <VStack gap="2">
                <Heading size="xl" color="fg">Payment Successful!</Heading>
                <Text color="fg.muted">
                  Your package has been activated. Redirecting to dashboard...
                </Text>
              </VStack>
              <Button colorPalette="green" size="lg" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </VStack>
          )}

          {state === "failed" && (
            <VStack gap="6">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="red.500/10"
                border="2px solid"
                borderColor="red.500/50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="red.400"
              >
                <LuCircleX size={40} />
              </Box>
              <VStack gap="2">
                <Heading size="xl" color="fg">Payment Failed</Heading>
                <Text color="fg.muted">
                  Your payment was not successful. Please try again.
                </Text>
              </VStack>
              <Button colorPalette="green" size="lg" onClick={handleRetry}>
                <LuRefreshCw />
                Try Again
              </Button>
            </VStack>
          )}

          {state === "abandoned" && (
            <VStack gap="6">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="orange.500/10"
                border="2px solid"
                borderColor="orange.500/50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="orange.400"
              >
                <LuCircleAlert size={40} />
              </Box>
              <VStack gap="2">
                <Heading size="xl" color="fg">Payment Abandoned</Heading>
                <Text color="fg.muted">
                  You left before completing the payment. Your package is not yet active.
                </Text>
              </VStack>
              <Button colorPalette="green" size="lg" onClick={handleRetry}>
                <LuRefreshCw />
                Try Again
              </Button>
            </VStack>
          )}

          {state === "error" && (
            <VStack gap="6">
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="red.500/10"
                border="2px solid"
                borderColor="red.500/50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="red.400"
              >
                <LuCircleAlert size={40} />
              </Box>
              <VStack gap="2">
                <Heading size="xl" color="fg">Verification Error</Heading>
                <Text color="fg.muted">
                  {errorMessage || "An error occurred while verifying your payment."}
                </Text>
              </VStack>
              <VStack gap="3" w="full">
                <Button colorPalette="green" size="lg" w="full" onClick={handleRetry}>
                  <LuRefreshCw />
                  Retry Payment
                </Button>
                <Button variant="ghost" size="md" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </VStack>
            </VStack>
          )}
        </Box>
      </Box>
    </AppShell>
  )
}
