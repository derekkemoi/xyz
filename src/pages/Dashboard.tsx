import { useEffect, useRef, useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Badge,
  Flex,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuLayoutDashboard,
  LuPackage,
  LuUsers,
  LuTrendingUp,
  LuLock,
  LuArrowRight,
  LuZap,
  LuCircleCheck,
  LuPen,
  LuTag,
  LuSmile,
  LuClipboardList,
  LuImage,
  LuFilter,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useAuthStore } from "@/store/auth-store"
import { useWalletStore } from "@/store/wallet-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useTaskStore } from "@/store/task-store"
import { formatCurrency } from "@/lib/formatters"
import { TASK_CATEGORIES_LIST } from "@/lib/task-data"
import { SAMPLE_TASKS } from "@/lib/task-data"

const ACTIVITY_FEED = [
  "James K. just withdrew $45.00 via M-PESA",
  "Mary A. completed 10 tasks • earned $8.50",
  "Peter O. just withdrew $120.00 via M-PESA",
  "Sophia N. completed 25 tasks • earned $75.00",
  "David M. just withdrew $280.00 via Bank",
  "Grace W. completed 15 tasks • earned $32.00",
  "Samuel T. just withdrew $95.00 via M-PESA",
  "Faith K. completed 8 tasks • earned $6.40",
  "Daniel L. just withdrew $200.00 via Bank",
  "Esther M. completed 20 tasks • earned $55.00",
]

const ICON_MAP: Record<string, React.ElementType> = {
  LuPen,
  LuTag,
  LuSmile,
  LuClipboardList,
  LuImage,
  LuFilter,
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { balance } = useWalletStore()
  const { activePackage } = useSubscriptionStore()
  const { completedTasks } = useTaskStore()
  const tickerRef = useRef<HTMLDivElement>(null)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <AppShell>
      <VStack gap="6" align="stretch">
        {/* Greeting */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="6"
          background="linear-gradient(135deg, rgba(34,197,94,0.1) 0%, transparent 60%)"
        >
          <HStack justify="space-between" wrap="wrap" gap="3">
            <VStack align="start" gap="1">
              <Heading size="lg" color="fg">
                {getGreeting()}, {user?.name?.split(" ")[0] || "Worker"}!
              </Heading>
              <Text color="fg.muted" fontSize="sm">{today}</Text>
            </VStack>
            <Badge colorPalette="green" variant="subtle" px="4" py="2" borderRadius="full" fontSize="sm">
              <LuZap size={12} />
              Active Account
            </Badge>
          </HStack>
        </Box>

        {/* Stats Row */}
        <SimpleGrid columns={{ base: 2, lg: 4 }} gap="4">
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="green.500/30"
            p="5"
            background="linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 70%)"
          >
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Available Balance
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="green.400">
                {formatCurrency(balance)}
              </Text>
              <Button
                size="xs"
                colorPalette="green"
                variant="ghost"
                px="2"
                onClick={() => navigate("/withdraw")}
              >
                Withdraw →
              </Button>
            </VStack>
          </Box>

          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            p="5"
          >
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Tasks Completed
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">
                {completedTasks.length}
              </Text>
              <Text fontSize="xs" color="fg.muted">All time</Text>
            </VStack>
          </Box>

          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            p="5"
          >
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Active Workers
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">
                2,847
              </Text>
              <HStack gap="1">
                <Box w="2" h="2" borderRadius="full" bg="green.400" />
                <Text fontSize="xs" color="green.400">Online now</Text>
              </HStack>
            </VStack>
          </Box>

          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            p="5"
          >
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Daily Availability
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">
                Open
              </Text>
              <Badge colorPalette="green" variant="subtle" size="sm">Accepting tasks</Badge>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Package Status */}
        {activePackage ? (
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="green.500/30"
            p="5"
          >
            <HStack justify="space-between" wrap="wrap" gap="3">
              <HStack gap="3">
                <Box
                  w="10"
                  h="10"
                  borderRadius="xl"
                  bg="green.500/15"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="green.400"
                >
                  <LuPackage size={20} />
                </Box>
                <VStack align="start" gap="0">
                  <HStack gap="2">
                    <Text fontWeight="bold" color="fg">{activePackage.name} Package</Text>
                    <Badge colorPalette="green" variant="subtle" size="sm">Active</Badge>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {activePackage.tasksPerDay} tasks/day • Up to {formatCurrency(activePackage.dailyEarnings)}/day
                  </Text>
                </VStack>
              </HStack>
              <Button
                size="sm"
                colorPalette="green"
                variant="outline"
                onClick={() => navigate("/packages")}
              >
                Upgrade
              </Button>
            </HStack>
          </Box>
        ) : (
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="2px dashed"
            borderColor="green.500/30"
            p="6"
            textAlign="center"
            background="linear-gradient(135deg, rgba(34,197,94,0.05) 0%, transparent 70%)"
          >
            <VStack gap="3">
              <Box color="green.400">
                <LuPackage size={32} />
              </Box>
              <VStack gap="1">
                <Text fontWeight="bold" color="fg" fontSize="lg">No Active Package</Text>
                <Text color="fg.muted" fontSize="sm" maxW="sm">
                  Activate a subscription package to unlock tasks and start earning money.
                </Text>
              </VStack>
              <Button colorPalette="green" size="md" onClick={() => navigate("/packages")}>
                View Packages
                <LuArrowRight />
              </Button>
            </VStack>
          </Box>
        )}

        {/* Live Activity Ticker */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="4"
          overflow="hidden"
        >
          <HStack gap="3" mb="3">
            <Box w="2" h="2" borderRadius="full" bg="green.400" />
            <Text fontSize="sm" fontWeight="semibold" color="fg">Live Activity</Text>
          </HStack>
          <Box overflow="hidden" position="relative">
            <Box
              display="flex"
              gap="8"
              style={{
                animation: "ticker 30s linear infinite",
              }}
              css={{
                "@keyframes ticker": {
                  "0%": { transform: "translateX(0)" },
                  "100%": { transform: "translateX(-50%)" },
                },
              }}
            >
              {[...ACTIVITY_FEED, ...ACTIVITY_FEED].map((item, i) => (
                <HStack key={i} gap="2" flexShrink={0} whiteSpace="nowrap">
                  <Box w="1.5" h="1.5" borderRadius="full" bg="green.400" flexShrink={0} />
                  <Text fontSize="sm" color="fg.muted">{item}</Text>
                </HStack>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Task Categories */}
        <Box>
          <HStack justify="space-between" mb="4">
            <VStack align="start" gap="0">
              <Heading size="md" color="fg">Task Marketplace</Heading>
              <Text fontSize="sm" color="fg.muted">Browse available task categories</Text>
            </VStack>
            <Button variant="ghost" size="sm" colorPalette="green" onClick={() => navigate("/tasks")}>
              View All
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 2, md: 3 }} gap="4">
            {TASK_CATEGORIES_LIST.slice(0, 6).map((cat) => {
              const IconComp = ICON_MAP[cat.icon]
              const isLocked = !activePackage
              return (
                <Box
                  key={cat.id}
                  bg="bg.panel"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border"
                  p="4"
                  cursor={isLocked ? "not-allowed" : "pointer"}
                  position="relative"
                  overflow="hidden"
                  opacity={isLocked ? 0.6 : 1}
                  _hover={isLocked ? {} : { borderColor: "green.500/40", bg: "bg.subtle" }}
                  transition="all 0.15s"
                  onClick={() => {
                    if (!isLocked) {
                      const task = SAMPLE_TASKS.find((t) => t.categoryId === cat.id) || SAMPLE_TASKS[0]
                      navigate(`/tasks/${task.id}`)
                    }
                  }}
                >
                  {isLocked && (
                    <Box
                      position="absolute"
                      top="2"
                      right="2"
                      color="fg.muted"
                    >
                      <LuLock size={14} />
                    </Box>
                  )}
                  <VStack align="start" gap="2">
                    <Box
                      w="9"
                      h="9"
                      borderRadius="lg"
                      bg="green.500/15"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="green.400"
                    >
                      {IconComp ? <IconComp size={18} /> : <LuZap size={18} />}
                    </Box>
                    <VStack align="start" gap="0">
                      <Text fontWeight="semibold" color="fg" fontSize="sm">{cat.name}</Text>
                      <Text fontSize="xs" color="fg.muted">{cat.taskCount} tasks</Text>
                    </VStack>
                    <Text fontSize="xs" color="green.400" fontWeight="semibold">
                      ~{formatCurrency(cat.avgReward)} avg
                    </Text>
                  </VStack>
                </Box>
              )
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </AppShell>
  )
}
