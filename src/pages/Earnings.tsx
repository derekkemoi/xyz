import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuArrowDownToLine,
  LuZap,
  LuCircleCheck,
  LuClock,
  LuCircleX,
  LuTrendingUp,
  LuWallet,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useWalletStore } from "@/store/wallet-store"
import { useAuthStore } from "@/store/auth-store"
import { formatCurrency, formatDateTime } from "@/lib/formatters"
import { WELCOME_BONUS_AMOUNT } from "@/lib/constants"

const WITHDRAWAL_STATUS_CONFIG = {
  pending: { color: "yellow", icon: LuClock, label: "Pending" },
  processing: { color: "blue", icon: LuClock, label: "Processing" },
  completed: { color: "green", icon: LuCircleCheck, label: "Completed" },
  failed: { color: "red", icon: LuCircleX, label: "Failed" },
}

export default function EarningsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { balance, earnings, withdrawals, welcomeBonusAwarded } = useWalletStore()

  const totalEarned = earnings.reduce((sum, e) => sum + e.amount, 0)
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0)

  return (
    <AppShell>
      <VStack gap="6" align="stretch">
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" gap="3">
          <Box>
            <Heading size="xl" color="fg" mb="1">Earnings</Heading>
            <Text color="fg.muted">Track your earnings and withdrawal history</Text>
          </Box>
          <Button colorPalette="green" onClick={() => navigate("/withdraw")}>
            <LuArrowDownToLine />
            Withdraw
          </Button>
        </HStack>

        {/* Balance Hero Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="green.500/30"
          p="6"
          background="linear-gradient(135deg, rgba(34,197,94,0.12) 0%, transparent 60%)"
        >
          <HStack justify="space-between" wrap="wrap" gap="4">
            <VStack align="start" gap="2">
              <HStack gap="2">
                <Box w="2" h="2" borderRadius="full" bg="green.400" />
                <Text fontSize="sm" color="fg.muted" fontWeight="medium">Available Balance</Text>
              </HStack>
              <HStack align="baseline" gap="2">
                <LuWallet size={24} color="var(--chakra-colors-green-400)" />
                <Text fontSize="4xl" fontWeight="extrabold" color="green.400">
                  {formatCurrency(balance)}
                </Text>
              </HStack>
              <Text fontSize="xs" color="fg.muted">Ready to withdraw</Text>
            </VStack>
            <Button
              size="lg"
              colorPalette="green"
              onClick={() => navigate("/withdraw")}
            >
              <LuArrowDownToLine />
              Withdraw Now
            </Button>
          </HStack>
        </Box>

        {/* Stats Row */}
        <SimpleGrid columns={{ base: 2, md: 3 }} gap="4">
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
            <VStack align="start" gap="1">
              <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Total Earned</Text>
              <Text fontSize="xl" fontWeight="bold" color="green.400">{formatCurrency(totalEarned)}</Text>
            </VStack>
          </Box>
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
            <VStack align="start" gap="1">
              <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Total Withdrawn</Text>
              <Text fontSize="xl" fontWeight="bold" color="fg">{formatCurrency(totalWithdrawn)}</Text>
            </VStack>
          </Box>
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4" gridColumn={{ base: "span 2", md: "auto" }}>
            <VStack align="start" gap="1">
              <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Earning Sources</Text>
              <Text fontSize="xl" fontWeight="bold" color="fg">{earnings.length}</Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Welcome Bonus Status */}
        <Box
          bg="bg.panel"
          borderRadius="xl"
          border="1px solid"
          borderColor={welcomeBonusAwarded ? "green.500/30" : "border"}
          p="4"
        >
          <HStack justify="space-between" wrap="wrap" gap="2">
            <HStack gap="3">
              <Box
                w="9"
                h="9"
                borderRadius="lg"
                bg={welcomeBonusAwarded ? "green.500/15" : "bg.subtle"}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={welcomeBonusAwarded ? "green.400" : "fg.muted"}
              >
                <LuZap size={18} />
              </Box>
              <VStack align="start" gap="0">
                <Text fontWeight="semibold" color="fg" fontSize="sm">Welcome Bonus</Text>
                <Text fontSize="xs" color="fg.muted">
                  {welcomeBonusAwarded
                    ? `$${WELCOME_BONUS_AMOUNT} bonus credited to your wallet`
                    : "Pass the assessment to claim your bonus"}
                </Text>
              </VStack>
            </HStack>
            <Badge
              colorPalette={welcomeBonusAwarded ? "green" : "gray"}
              variant="subtle"
              px="3"
              py="1"
            >
              {welcomeBonusAwarded ? (
                <HStack gap="1">
                  <LuCircleCheck size={10} />
                  <Text>Claimed</Text>
                </HStack>
              ) : "Not Claimed"}
            </Badge>
          </HStack>
        </Box>

        {/* Earnings History */}
        <Box>
          <HStack justify="space-between" mb="4">
            <Heading size="md" color="fg">Earnings History</Heading>
            <Badge variant="subtle" colorPalette="green">{earnings.length} entries</Badge>
          </HStack>

          {earnings.length === 0 ? (
            <Box
              bg="bg.panel"
              borderRadius="xl"
              border="1px dashed"
              borderColor="border"
              p="8"
              textAlign="center"
            >
              <VStack gap="2">
                <Box color="fg.muted">
                  <LuTrendingUp size={32} />
                </Box>
                <Text color="fg.muted">No earnings yet. Complete tasks to start earning!</Text>
                <Button size="sm" colorPalette="green" variant="outline" onClick={() => navigate("/tasks")}>
                  Browse Tasks
                </Button>
              </VStack>
            </Box>
          ) : (
            <VStack gap="2" align="stretch">
              {earnings.map((entry) => (
                <Box
                  key={entry.id}
                  bg="bg.panel"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border"
                  px="4"
                  py="3"
                  _hover={{ bg: "bg.subtle" }}
                  transition="background 0.1s"
                >
                  <HStack justify="space-between">
                    <HStack gap="3">
                      <Box
                        w="8"
                        h="8"
                        borderRadius="lg"
                        bg={entry.source === "welcome_bonus" ? "yellow.500/15" : "green.500/10"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={entry.source === "welcome_bonus" ? "yellow.400" : "green.400"}
                      >
                        {entry.source === "welcome_bonus" ? <LuZap size={14} /> : <LuCircleCheck size={14} />}
                      </Box>
                      <VStack align="start" gap="0">
                        <Text fontWeight="semibold" color="fg" fontSize="sm">{entry.description}</Text>
                        <Text fontSize="xs" color="fg.muted">{formatDateTime(entry.createdAt)}</Text>
                      </VStack>
                    </HStack>
                    <Text fontWeight="bold" color="green.400">+{formatCurrency(entry.amount)}</Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Withdrawals History */}
        {withdrawals.length > 0 && (
          <Box>
            <HStack justify="space-between" mb="4">
              <Heading size="md" color="fg">Withdrawal History</Heading>
              <Badge variant="subtle">{withdrawals.length}</Badge>
            </HStack>
            <VStack gap="2" align="stretch">
              {withdrawals.map((w) => {
                const statusConfig = WITHDRAWAL_STATUS_CONFIG[w.status]
                const StatusIcon = statusConfig.icon
                return (
                  <Box
                    key={w.id}
                    bg="bg.panel"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="border"
                    px="4"
                    py="3"
                  >
                    <HStack justify="space-between" wrap="wrap" gap="2">
                      <HStack gap="3">
                        <Box
                          w="8"
                          h="8"
                          borderRadius="lg"
                          bg="bg.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="fg.muted"
                        >
                          <LuArrowDownToLine size={14} />
                        </Box>
                        <VStack align="start" gap="0">
                          <Text fontWeight="semibold" color="fg" fontSize="sm">
                            Withdrawal via {w.method}
                          </Text>
                          <Text fontSize="xs" color="fg.muted">{formatDateTime(w.requestedAt)}</Text>
                        </VStack>
                      </HStack>
                      <HStack gap="3">
                        <Text fontWeight="bold" color="fg">-{formatCurrency(w.amount)}</Text>
                        <Badge colorPalette={statusConfig.color} variant="subtle" size="sm">
                          <StatusIcon size={10} />
                          {statusConfig.label}
                        </Badge>
                      </HStack>
                    </HStack>
                  </Box>
                )
              })}
            </VStack>
          </Box>
        )}
      </VStack>
    </AppShell>
  )
}
