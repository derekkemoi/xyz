import { useEffect, useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Badge,
  Spinner,
  Flex,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { LuCircleCheck, LuZap, LuStar, LuArrowRight, LuTrendingUp, LuCreditCard } from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { fetchPackages, fetchPaymentConfig } from "@/lib/api"
import type { Package } from "@/types/package"
import { useAuthStore } from "@/store/auth-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { formatCurrency } from "@/lib/formatters"
import { toaster } from "@/components/ui/toaster"

const PACKAGE_COLORS: Record<string, string> = {
  beginner: "blue",
  average_skilled: "purple",
  expert: "green",
  elite: "orange",
}

export default function PackagesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { activePackage } = useSubscriptionStore()
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activatingId, setActivatingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const pkgs = await fetchPackages()
        setPackages(pkgs)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleActivate = async (pkg: Package) => {
    setActivatingId(pkg.id)
    try {
      const config = await fetchPaymentConfig()
      if (config.paymentMethod === "M_PESA") {
        navigate("/payments/mpesa", { state: { package: pkg } })
      } else {
        navigate("/payments/paystack", { state: { package: pkg } })
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Failed to get payment config. Please try again.",
        type: "error",
      })
    } finally {
      setActivatingId(null)
    }
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" color="fg" mb="1">Subscription Packages</Heading>
          <Text color="fg.muted">Choose a package to unlock tasks and start earning</Text>
        </Box>

        {/* Active Package Banner */}
        {activePackage && (
          <Box
            bg="green.500/10"
            border="1px solid"
            borderColor="green.500/30"
            borderRadius="xl"
            p="4"
          >
            <HStack gap="3">
              <Box color="green.400">
                <LuCircleCheck size={20} />
              </Box>
              <VStack align="start" gap="0">
                <Text fontWeight="bold" color="fg">
                  Active Package: {activePackage.name}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {activePackage.tasksPerDay} tasks/day • Up to {formatCurrency(activePackage.dailyEarnings)}/day
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {isLoading ? (
          <Flex justify="center" py="16">
            <VStack gap="3">
              <Spinner size="lg" color="green.400" />
              <Text color="fg.muted">Loading packages...</Text>
            </VStack>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="5">
            {packages.map((pkg) => {
              const isActive = activePackage?.id === pkg.id
              const colorKey = PACKAGE_COLORS[pkg.tier] || "green"
              const isPopular = pkg.tier === "expert"
              const isLoading = activatingId === pkg.id

              return (
                <Box
                  key={pkg.id}
                  bg="bg.panel"
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={isActive ? "green.500" : isPopular ? "green.500/40" : "border"}
                  p="6"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    borderColor: isActive ? "green.500" : "green.500/50",
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  {isPopular && !isActive && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="green.500"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                      px="3"
                      py="1"
                      borderBottomLeftRadius="lg"
                    >
                      <HStack gap="1">
                        <LuStar size={10} />
                        <Text>MOST POPULAR</Text>
                      </HStack>
                    </Box>
                  )}

                  {isActive && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="green.500"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                      px="3"
                      py="1"
                      borderBottomLeftRadius="lg"
                    >
                      ACTIVE
                    </Box>
                  )}

                  <VStack align="start" gap="5">
                    {/* Package Name */}
                    <Text fontWeight="bold" fontSize="lg" color="fg">
                      {pkg.name}
                    </Text>

                    {/* Pay vs Earn — the core value prop */}
                    <VStack gap="2" w="full">
                      {/* Cost to subscribe */}
                      <Box
                        w="full"
                        bg="bg.muted"
                        border="1px solid"
                        borderColor="border"
                        borderRadius="xl"
                        px="4"
                        py="3"
                      >
                        <HStack justify="space-between" align="center">
                          <VStack align="start" gap="0">
                            <HStack gap="1.5" color="fg.muted">
                              <LuCreditCard size={13} />
                              <Text fontSize="xs" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                                You Pay
                              </Text>
                            </HStack>
                            <HStack align="baseline" gap="1" mt="0.5">
                              <Text fontSize="2xl" fontWeight="extrabold" color="fg">
                                {formatCurrency(pkg.amount)}
                              </Text>
                              <Text fontSize="xs" color="fg.muted">one-time</Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </Box>

                      <Box color="fg.subtle" alignSelf="center">
                        <LuArrowRight size={14} />
                      </Box>

                      {/* Monthly earnings */}
                      <Box
                        w="full"
                        bg="green.500/10"
                        border="1px solid"
                        borderColor="green.500/30"
                        borderRadius="xl"
                        px="4"
                        py="3"
                      >
                        <HStack justify="space-between" align="center">
                          <VStack align="start" gap="0">
                            <HStack gap="1.5" color="green.400">
                              <LuTrendingUp size={13} />
                              <Text fontSize="xs" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                                You Earn
                              </Text>
                            </HStack>
                            <HStack align="baseline" gap="1" mt="0.5">
                              <Text fontSize="2xl" fontWeight="extrabold" color="green.400">
                                {formatCurrency(pkg.monthlyEarnings)}
                              </Text>
                              <Text fontSize="xs" color="fg.muted">/month</Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </Box>
                    </VStack>

                    {/* Earnings breakdown */}
                    <Box
                      bg="bg.subtle"
                      borderRadius="xl"
                      p="3"
                      w="full"
                    >
                      <VStack gap="1.5" align="start">
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color="fg.muted">Daily earnings</Text>
                          <Text fontSize="sm" fontWeight="semibold" color="green.400">
                            {formatCurrency(pkg.dailyEarnings)}/day
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color="fg.muted">Tasks per day</Text>
                          <Text fontSize="sm" fontWeight="semibold" color="fg">
                            {pkg.tasksPerDay} tasks
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color="fg.muted">Earning per task</Text>
                          <Text fontSize="sm" fontWeight="semibold" color="fg">
                            {formatCurrency(pkg.pricePerTask.min)} – {formatCurrency(pkg.pricePerTask.max)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    {/* Benefits */}
                    <VStack align="start" gap="2" w="full">
                      {(pkg.benefits || []).map((benefit, i) => (
                        <HStack key={i} gap="2">
                          <Box color="green.400" flexShrink={0}>
                            <LuCircleCheck size={14} />
                          </Box>
                          <Text fontSize="sm" color="fg.muted">{benefit}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    {/* CTA */}
                    <Button
                      w="full"
                      colorPalette="green"
                      variant={isActive ? "surface" : isPopular ? "solid" : "outline"}
                      disabled={isActive}
                      loading={isLoading}
                      loadingText="Processing..."
                      onClick={() => !isActive && handleActivate(pkg)}
                    >
                      {isActive ? (
                        <>
                          <LuCircleCheck />
                          Currently Active
                        </>
                      ) : (
                        <>
                          <LuZap />
                          Activate Package
                        </>
                      )}
                    </Button>
                  </VStack>
                </Box>
              )
            })}
          </SimpleGrid>
        )}

        {/* Info note */}
        <Box
          bg="bg.subtle"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
          p="4"
        >
          <HStack gap="2">
            <Box color="fg.muted">
              <LuCircleCheck size={16} />
            </Box>
            <Text fontSize="sm" color="fg.muted">
              Packages are paid once and unlock tasks that earn the stated monthly amount. All earnings are paid directly to your wallet.
            </Text>
          </HStack>
        </Box>
      </VStack>
    </AppShell>
  )
}
