import { useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Textarea,
} from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LuArrowLeft,
  LuSmartphone,
  LuCircleCheck,
  LuCopy,
  LuMessageSquare,
  LuTriangleAlert,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import type { Package } from "@/types/package"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { usePaymentStore } from "@/store/payment-store"
import { toaster } from "@/components/ui/toaster"
import { formatCurrency, generateId } from "@/lib/formatters"
import { MPESA_TILL_NAME } from "@/lib/constants"

const TILL_NUMBER = "8117840"

const STEPS = [
  { number: "1", title: "Go to M-PESA on your phone", description: "Open the M-PESA menu on your Safaricom SIM" },
  { number: "2", title: "Select 'Lipa na M-PESA'", description: "Find this option in the main M-PESA menu" },
  { number: "3", title: "Select 'Buy Goods and Services'", description: "Choose the buy goods option" },
  { number: "4", title: "Enter Till Number", description: `Enter till number: ${TILL_NUMBER}`, highlight: TILL_NUMBER },
  { number: "5", title: "Enter Amount", description: "Enter the KES amount shown above" },
  { number: "6", title: "Enter your M-PESA PIN and confirm", description: "Complete the payment with your PIN" },
]

type PageStep = "instructions" | "verify"

function parseMpesaMessage(message: string): { tillName: string | null; amount: number | null } {
  const tillMatch = message.match(/paid to\s+([A-Z][A-Z\s]+?)\s*\./i)
  const amountMatch = message.match(/Ksh([\d,]+\.?\d*)/i)

  const tillName = tillMatch ? tillMatch[1].trim().toUpperCase() : null
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null

  return { tillName, amount }
}

export default function MPesaPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const { setActivePackage } = useSubscriptionStore()
  const { addPayment } = usePaymentStore()
  const [pageStep, setPageStep] = useState<PageStep>("instructions")
  const [smsText, setSmsText] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const amountKES = Math.round(pkg.amount * 130)

  const copyTill = () => {
    navigator.clipboard.writeText(TILL_NUMBER).then(() => {
      toaster.create({
        title: "Copied!",
        description: `Till number ${TILL_NUMBER} copied to clipboard`,
        type: "success",
      })
    })
  }

  const handleVerifySms = () => {
    setValidationError(null)

    if (!smsText.trim()) {
      setValidationError("Please paste your M-PESA confirmation message.")
      return
    }

    const { tillName, amount } = parseMpesaMessage(smsText)

    if (!tillName) {
      setValidationError("Could not extract the till name from your message. Please make sure you pasted the full M-PESA confirmation SMS.")
      return
    }

    if (!amount) {
      setValidationError("Could not extract the payment amount from your message. Please make sure you pasted the full M-PESA confirmation SMS.")
      return
    }

    if (tillName !== MPESA_TILL_NAME) {
      setValidationError(`Payment was sent to "${tillName}" but should be sent to "${MPESA_TILL_NAME}". Please use the correct till number.`)
      return
    }

    if (amount < amountKES) {
      setValidationError(`Payment amount KES ${amount.toLocaleString()} does not match required KES ${amountKES.toLocaleString()} for this package.`)
      return
    }

    setIsProcessing(true)
    const reference = `MPESA_${generateId()}`

    setTimeout(() => {
      if (user) {
        addPayment(user.id, pkg.id, pkg.amount, "M_PESA", reference)
        setActivePackage(pkg, user.id)
      }

      toaster.create({
        title: "Payment Verified!",
        description: `Your ${pkg.name} package is now active. Happy earning!`,
        type: "success",
      })

      navigate("/dashboard")
      setIsProcessing(false)
    }, 1000)
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch" maxW="560px" mx="auto">
        {/* Header */}
        <HStack gap="3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => pageStep === "verify" ? setPageStep("instructions") : navigate("/packages")}
            px="2"
          >
            <LuArrowLeft />
            Back
          </Button>
          <Box>
            <Heading size="lg" color="fg">M-PESA Payment</Heading>
            <Text fontSize="sm" color="fg.muted">
              {pageStep === "instructions" ? "Pay via M-PESA Buy Goods" : "Verify your payment"}
            </Text>
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
              <Text fontSize="sm" color="fg.muted">Amount to Pay</Text>
              <Text fontSize="3xl" fontWeight="extrabold" color="green.400">
                KES {amountKES.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="fg.muted">(≈ {formatCurrency(pkg.amount)})</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Step: Instructions */}
        {pageStep === "instructions" && (
          <>
            <Box
              bg="bg.panel"
              borderRadius="2xl"
              border="1px solid"
              borderColor="border"
              overflow="hidden"
            >
              <Box bg="bg.subtle" px="6" py="4" borderBottom="1px solid" borderColor="border">
                <HStack gap="2">
                  <LuSmartphone size={18} color="var(--chakra-colors-green-400)" />
                  <Text fontWeight="bold" color="fg">Payment Instructions</Text>
                </HStack>
              </Box>

              <VStack gap="0" align="stretch" p="4">
                {STEPS.map((step, i) => (
                  <HStack
                    key={i}
                    gap="4"
                    p="3"
                    borderRadius="xl"
                    _hover={{ bg: "bg.subtle" }}
                    align="start"
                  >
                    <Box
                      w="8"
                      h="8"
                      borderRadius="full"
                      bg="green.500/15"
                      border="1.5px solid"
                      borderColor="green.500/40"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text fontSize="xs" fontWeight="bold" color="green.400">{step.number}</Text>
                    </Box>
                    <VStack align="start" gap="0.5" flex="1">
                      <Text fontWeight="semibold" color="fg" fontSize="sm">{step.title}</Text>
                      {step.highlight ? (
                        <HStack gap="2" mt="1">
                          <Box
                            bg="green.500/15"
                            border="1px solid"
                            borderColor="green.500/40"
                            borderRadius="lg"
                            px="3"
                            py="1"
                          >
                            <Text fontSize="lg" fontWeight="extrabold" color="green.400" letterSpacing="wider">
                              {step.highlight}
                            </Text>
                          </Box>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorPalette="green"
                            onClick={copyTill}
                          >
                            <LuCopy size={12} />
                            Copy
                          </Button>
                        </HStack>
                      ) : (
                        <Text fontSize="xs" color="fg.muted">{step.description}</Text>
                      )}
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Amount Reminder */}
            <Box
              bg="bg.panel"
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
              p="4"
            >
              <HStack justify="space-between">
                <Text fontSize="sm" color="fg.muted">Enter this exact amount:</Text>
                <HStack gap="2">
                  <Text fontWeight="extrabold" color="green.400" fontSize="xl">
                    KES {amountKES.toLocaleString()}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorPalette="green"
                    onClick={() => {
                      navigator.clipboard.writeText(amountKES.toString())
                      toaster.create({ title: "Amount copied!", type: "success" })
                    }}
                  >
                    <LuCopy size={12} />
                  </Button>
                </HStack>
              </HStack>
            </Box>

            <Button
              colorPalette="green"
              size="lg"
              w="full"
              onClick={() => setPageStep("verify")}
            >
              <LuCircleCheck />
              I Have Paid — Verify Payment
            </Button>

            <Text fontSize="xs" color="fg.muted" textAlign="center">
              Click the button above after completing your M-PESA payment to proceed with verification.
            </Text>
          </>
        )}

        {/* Step: Verify SMS */}
        {pageStep === "verify" && (
          <>
            <Box
              bg="bg.panel"
              borderRadius="2xl"
              border="1px solid"
              borderColor="border"
              overflow="hidden"
            >
              <Box bg="bg.subtle" px="6" py="4" borderBottom="1px solid" borderColor="border">
                <HStack gap="2">
                  <LuMessageSquare size={18} color="var(--chakra-colors-green-400)" />
                  <Text fontWeight="bold" color="fg">Paste M-PESA Confirmation Message</Text>
                </HStack>
              </Box>

              <VStack gap="4" p="6" align="stretch">
                <Text fontSize="sm" color="fg.muted">
                  After completing your payment, M-PESA will send you a confirmation SMS. Please paste the full message below so we can verify your payment.
                </Text>

                <Box
                  bg="bg.subtle"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border"
                  p="3"
                >
                  <Text fontSize="xs" color="fg.muted" mb="1">Example message format:</Text>
                  <Text fontSize="xs" color="fg.subtle" fontStyle="italic" lineHeight="relaxed">
                    UDD4R0YF57 Confirmed. Ksh500.00 paid to FOOTBALL HIGHWAY ENTERPRISES. on 13/4/26 at 3:34 PM...
                  </Text>
                </Box>

                <Textarea
                  value={smsText}
                  onChange={(e) => {
                    setSmsText(e.target.value)
                    setValidationError(null)
                  }}
                  placeholder="Paste your M-PESA confirmation SMS here..."
                  rows={5}
                  bg="bg.subtle"
                  borderColor={validationError ? "red.500" : "border"}
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                  fontSize="sm"
                  resize="vertical"
                />

                {validationError && (
                  <HStack
                    gap="2"
                    bg="red.500/10"
                    border="1px solid"
                    borderColor="red.500/30"
                    borderRadius="xl"
                    p="3"
                    align="start"
                  >
                    <Box color="red.400" flexShrink={0} mt="0.5">
                      <LuTriangleAlert size={16} />
                    </Box>
                    <Text fontSize="sm" color="red.400">{validationError}</Text>
                  </HStack>
                )}

                <Button
                  colorPalette="green"
                  size="lg"
                  w="full"
                  onClick={handleVerifySms}
                  loading={isProcessing}
                  loadingText="Activating package..."
                  disabled={!smsText.trim()}
                >
                  <LuCircleCheck />
                  Verify & Activate Package
                </Button>
              </VStack>
            </Box>

            <Text fontSize="xs" color="fg.muted" textAlign="center">
              Your payment will be verified against the till name and amount. Package activates immediately after successful verification.
            </Text>
          </>
        )}
      </VStack>
    </AppShell>
  )
}
