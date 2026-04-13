import { useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { LuArrowDownToLine, LuWallet, LuSmartphone } from "react-icons/lu"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import AppShell from "@/components/layout/AppShell"
import { Field } from "@/components/ui/field"
import { Alert } from "@/components/ui/alert"
import { toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/auth-store"
import { useWalletStore } from "@/store/wallet-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { formatCurrency } from "@/lib/formatters"

const withdrawSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Please enter a valid amount" })
    .min(5, "Minimum withdrawal is $5.00")
    .positive("Amount must be positive"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9+\s\-()]+$/, "Invalid phone number format"),
})

type WithdrawFormData = z.infer<typeof withdrawSchema>

export default function WithdrawPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { balance, addWithdrawal } = useWalletStore()
  const { activePackage } = useSubscriptionStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawSchema),
  })

  const onSubmit = (data: WithdrawFormData) => {
    if (!activePackage) return
    if (data.amount > balance) {
      toaster.create({
        title: "Insufficient Balance",
        description: `Your balance is ${formatCurrency(balance)}`,
        type: "error",
      })
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      if (user) {
        addWithdrawal(user.id, data.amount, "M-PESA")
      }
      toaster.create({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal is being processed. It will be completed within 24-72 hours.",
        type: "success",
      })
      navigate("/earnings")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch" maxW="520px" mx="auto">
        {/* Header */}
        <Box>
          <Heading size="xl" color="fg" mb="1">Withdraw Funds</Heading>
          <Text color="fg.muted">Transfer your earnings to M-PESA</Text>
        </Box>

        {/* Balance Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="green.500/30"
          p="5"
          background="linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 70%)"
        >
          <HStack justify="space-between">
            <VStack align="start" gap="0">
              <Text fontSize="sm" color="fg.muted">Available Balance</Text>
              <HStack gap="2" align="baseline">
                <LuWallet size={18} color="var(--chakra-colors-green-400)" />
                <Text fontSize="2xl" fontWeight="extrabold" color="green.400">
                  {formatCurrency(balance)}
                </Text>
              </HStack>
            </VStack>
            <Button
              size="sm"
              variant="outline"
              colorPalette="green"
              onClick={() => setValue("amount", balance)}
            >
              Withdraw All
            </Button>
          </HStack>
        </Box>

        {/* Alerts */}
        {!activePackage ? (
          <Alert status="error" title="Package Required">
            You need an active package subscription to process any transaction.
            <Button
              size="sm"
              colorPalette="green"
              mt="3"
              onClick={() => navigate("/packages")}
            >
              View Packages
            </Button>
          </Alert>
        ) : (
          <Alert status="info" title="Processing Time">
            Your account is under review. Withdrawal processing takes 24 to 72 hours. Please ensure your M-PESA number is correct.
          </Alert>
        )}

        {/* Withdrawal Form */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="6"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap="5">
              <Field
                label="Withdrawal Amount (USD)"
                invalid={!!errors.amount}
                errorText={errors.amount?.message}
                helperText={`Minimum: $5.00 • Maximum: ${formatCurrency(balance)}`}
                w="full"
              >
                <Input
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="5"
                  max={balance}
                  placeholder="e.g. 10.00"
                  size="lg"
                  bg="bg.subtle"
                  borderColor="border"
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                  disabled={!activePackage}
                />
              </Field>

              <Field
                label="M-PESA Phone Number"
                invalid={!!errors.phone}
                errorText={errors.phone?.message}
                helperText="Enter your M-PESA registered phone number"
                w="full"
              >
                <HStack w="full" gap="2">
                  <Box
                    bg="bg.subtle"
                    border="1px solid"
                    borderColor="border"
                    borderRadius="lg"
                    px="3"
                    h="12"
                    display="flex"
                    alignItems="center"
                    color="fg.muted"
                    flexShrink={0}
                  >
                    <LuSmartphone size={16} />
                  </Box>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="+254 712 345 678"
                    size="lg"
                    bg="bg.subtle"
                    borderColor="border"
                    _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                    disabled={!activePackage}
                  />
                </HStack>
              </Field>

              <Box w="full" bg="bg.subtle" borderRadius="xl" p="4">
                <VStack gap="2" align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">Processing Fee</Text>
                    <Text fontSize="sm" color="fg">Free</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">Processing Time</Text>
                    <Text fontSize="sm" color="fg">24-72 hours</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.muted">Method</Text>
                    <Text fontSize="sm" color="fg">M-PESA</Text>
                  </HStack>
                </VStack>
              </Box>

              <Button
                type="submit"
                colorPalette="green"
                size="lg"
                w="full"
                disabled={!activePackage || balance < 5}
                loading={isSubmitting}
                loadingText="Processing..."
              >
                <LuArrowDownToLine />
                Submit Withdrawal Request
              </Button>

              {balance < 5 && activePackage && (
                <Text fontSize="sm" color="fg.muted" textAlign="center">
                  You need at least $5.00 to withdraw. Keep completing tasks!
                </Text>
              )}
            </VStack>
          </form>
        </Box>
      </VStack>
    </AppShell>
  )
}
