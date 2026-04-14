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
  Flex,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuPackage,
  LuLock,
  LuArrowRight,
  LuZap,
  LuPen,
  LuTag,
  LuSmile,
  LuClipboardList,
  LuImage,
  LuFilter,
  LuShieldCheck,
  LuCircleCheck,
  LuBanknote,
  LuStar,
  LuX,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useAuthStore } from "@/store/auth-store"
import { useWalletStore } from "@/store/wallet-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useTaskStore } from "@/store/task-store"
import { formatCurrency } from "@/lib/formatters"
import { TASK_CATEGORIES_LIST, SAMPLE_TASKS } from "@/lib/task-data"

const WITHDRAWAL_FEED = [
  { name: "James Kamau", location: "Nairobi", amount: "KES 4,500", method: "M-PESA", time: "2 min ago" },
  { name: "Mary Achieng", location: "Kisumu", amount: "KES 2,800", method: "M-PESA", time: "5 min ago" },
  { name: "Peter Otieno", location: "Mombasa", amount: "KES 12,000", method: "Bank", time: "8 min ago" },
  { name: "Sophia Njeri", location: "Nakuru", amount: "KES 7,500", method: "M-PESA", time: "11 min ago" },
  { name: "David Mwangi", location: "Nairobi", amount: "KES 28,000", method: "Bank", time: "14 min ago" },
  { name: "Grace Wanjiku", location: "Thika", amount: "KES 3,200", method: "M-PESA", time: "17 min ago" },
  { name: "Samuel Tarus", location: "Eldoret", amount: "KES 9,500", method: "M-PESA", time: "20 min ago" },
  { name: "Faith Karimi", location: "Meru", amount: "KES 1,800", method: "M-PESA", time: "23 min ago" },
  { name: "Daniel Lugala", location: "Kakamega", amount: "KES 20,000", method: "Bank", time: "26 min ago" },
  { name: "Esther Mutua", location: "Machakos", amount: "KES 5,500", method: "M-PESA", time: "29 min ago" },
  { name: "Brian Kipchoge", location: "Kericho", amount: "KES 6,200", method: "M-PESA", time: "32 min ago" },
  { name: "Lydia Ochieng", location: "Homa Bay", amount: "KES 3,800", method: "M-PESA", time: "35 min ago" },
  { name: "Kevin Ndung'u", location: "Kiambu", amount: "KES 15,000", method: "Bank", time: "38 min ago" },
  { name: "Agnes Chebet", location: "Bomet", amount: "KES 4,100", method: "M-PESA", time: "41 min ago" },
  { name: "Victor Omondi", location: "Kisii", amount: "KES 8,900", method: "M-PESA", time: "44 min ago" },
  { name: "Irene Wambua", location: "Kitui", amount: "KES 2,600", method: "M-PESA", time: "47 min ago" },
  { name: "Collins Rotich", location: "Nandi", amount: "KES 11,200", method: "Bank", time: "50 min ago" },
  { name: "Mercy Adhiambo", location: "Siaya", amount: "KES 3,400", method: "M-PESA", time: "53 min ago" },
  { name: "Edwin Kiptoo", location: "Uasin Gishu", amount: "KES 7,000", method: "M-PESA", time: "56 min ago" },
  { name: "Naomi Wanjiru", location: "Nyeri", amount: "KES 5,300", method: "M-PESA", time: "59 min ago" },
]

const ICON_MAP: Record<string, React.ElementType> = {
  LuPen,
  LuTag,
  LuSmile,
  LuClipboardList,
  LuImage,
  LuFilter,
}

const SOCIAL_PROOF = [
  { stat: "2,847+", label: "Active Workers" },
  { stat: "KES 4.2M+", label: "Paid Out This Month" },
  { stat: "98%", label: "On-Time Payments" },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function LiveWithdrawalTicker() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => (v + 1) % WITHDRAWAL_FEED.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const entry = WITHDRAWAL_FEED[visible]

  return (
    <Box
      bg="bg.panel"
      borderRadius="2xl"
      border="1px solid"
      borderColor="green.500/25"
      p="4"
      overflow="hidden"
    >
      <HStack gap="3" mb="3" justify="space-between">
        <HStack gap="2">
          <Box
            w="2"
            h="2"
            borderRadius="full"
            bg="green.400"
            style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
            css={{
              "@keyframes ping": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "75%, 100%": { transform: "scale(2)", opacity: 0 },
              },
            }}
          />
          <Text fontSize="sm" fontWeight="semibold" color="fg">Live Withdrawals</Text>
        </HStack>
        <Badge colorPalette="green" variant="subtle" size="sm">Real-time</Badge>
      </HStack>

      <Box
        key={visible}
        style={{
          animation: "slideIn 0.4s ease-out",
        }}
        css={{
          "@keyframes slideIn": {
            from: { opacity: 0, transform: "translateY(-8px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <HStack
          bg="green.500/8"
          border="1px solid"
          borderColor="green.500/20"
          borderRadius="xl"
          px="4"
          py="3"
          gap="3"
        >
          <Box
            w="9"
            h="9"
            borderRadius="full"
            bg="green.500/20"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="green.400"
            flexShrink={0}
          >
            <LuBanknote size={16} />
          </Box>
          <VStack align="start" gap="0" flex="1">
            <Text fontSize="sm" fontWeight="semibold" color="fg">
              {entry.name}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {entry.location} • {entry.method} • {entry.time}
            </Text>
          </VStack>
          <Text fontWeight="extrabold" color="green.400" fontSize="sm" flexShrink={0}>
            {entry.amount}
          </Text>
        </HStack>
      </Box>

      <Text fontSize="xs" color="fg.subtle" mt="2" textAlign="center">
        {WITHDRAWAL_FEED.length} Many withdrew earnings today
      </Text>
    </Box>
  )
}

function NoPackageModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="overlay"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="4"
      backdropFilter="blur(4px)"
    >
      <Box
        bg="bg.panel"
        borderRadius="2xl"
        border="2px solid"
        borderColor="green.500/30"
        p={{ base: "6", md: "8" }}
        maxW="440px"
        w="full"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="100px"
          background="radial-gradient(ellipse at top, rgba(34,197,94,0.12) 0%, transparent 70%)"
          pointerEvents="none"
        />

        <VStack gap="5" position="relative">
          <Box
            w="16"
            h="16"
            borderRadius="full"
            bg="green.500/15"
            border="2px solid"
            borderColor="green.500/40"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="green.400"
          >
            <LuShieldCheck size={30} />
          </Box>

          <VStack gap="2" textAlign="center">
            <Heading size="lg" color="fg" fontWeight="extrabold">
              Activate Your Package
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              You need an active subscription package to take tasks, earn money, and withdraw your earnings.
            </Text>
          </VStack>

          {/* Benefits */}
          <Box
            w="full"
            bg="bg.subtle"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            p="4"
          >
            <VStack gap="2.5" align="start">
              {[
                "Unlock paid AI training tasks daily",
                "Earn money for every task completed",
                "Withdraw directly via M-PESA or Bank",
              ].map((b) => (
                <HStack key={b} gap="2.5">
                  <Box color="green.400" flexShrink={0}>
                    <LuCircleCheck size={16} />
                  </Box>
                  <Text fontSize="sm" color="fg">{b}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          <Button
            colorPalette="green"
            size="lg"
            w="full"
            onClick={() => navigate("/packages")}
          >
            <LuPackage />
            View Packages
            <LuArrowRight />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            color="fg.muted"
            onClick={onClose}
            _hover={{ color: "fg" }}
          >
            <LuX size={14} />
            Remind me later
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { balance } = useWalletStore()
  const { activePackage } = useSubscriptionStore()
  const { completedTasks } = useTaskStore()
  const [showModal, setShowModal] = useState(false)

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    if (!activePackage) {
      const timer = setTimeout(() => setShowModal(true), 800)
      return () => clearTimeout(timer)
    }
  }, [activePackage])

  return (
    <AppShell>
      {showModal && !activePackage && (
        <NoPackageModal onClose={() => setShowModal(false)} />
      )}

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

          <Box bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" p="5">
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Tasks Completed
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">{completedTasks.length}</Text>
              <Text fontSize="xs" color="fg.muted">All time</Text>
            </VStack>
          </Box>

          <Box bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" p="5">
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Active Workers
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">2,847</Text>
              <HStack gap="1">
                <Box w="2" h="2" borderRadius="full" bg="green.400" />
                <Text fontSize="xs" color="green.400">Online now</Text>
              </HStack>
            </VStack>
          </Box>

          <Box bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" p="5">
            <VStack align="start" gap="2">
              <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                Daily Availability
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="fg">Open</Text>
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
                  w="10" h="10" borderRadius="xl"
                  bg="green.500/15"
                  display="flex" alignItems="center" justifyContent="center"
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
              <Button size="sm" colorPalette="green" variant="outline" onClick={() => navigate("/packages")}>
                Upgrade
              </Button>
            </HStack>
          </Box>
        ) : (
          /* Persuasive CTA block when no package */
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="2px solid"
            borderColor="green.500/40"
            p="6"
            position="relative"
            overflow="hidden"
            background="linear-gradient(135deg, rgba(34,197,94,0.07) 0%, transparent 70%)"
          >
            <Box
              position="absolute"
              top="0"
              right="0"
              w="200px"
              h="200px"
              borderRadius="full"
              bg="green.500/5"
              transform="translate(60px, -60px)"
              pointerEvents="none"
            />
            <Flex gap="6" direction={{ base: "column", md: "row" }} align={{ md: "center" }}>
              <VStack align="start" gap="3" flex="1">
                <Badge colorPalette="green" variant="solid" px="3" py="1" borderRadius="full" fontSize="xs">
                  <LuStar size={10} />
                  Start Earning Today
                </Badge>
                <VStack align="start" gap="1">
                  <Heading size="md" color="fg">
                    One package. Daily earnings.
                  </Heading>
                  <Text color="fg.muted" fontSize="sm" maxW="sm">
                    Thousands are already earning from AI tasks every day. Activate your package and join them.
                  </Text>
                </VStack>
                <VStack align="start" gap="1.5" w="full">
                  {[
                    "Complete simple AI tasks from your phone",
                    "Earn up to KES 40,000+ per month",
                    "Withdraw via M-PESA anytime",
                  ].map((b) => (
                    <HStack key={b} gap="2">
                      <Box color="green.400" flexShrink={0}><LuCircleCheck size={15} /></Box>
                      <Text fontSize="sm" color="fg.muted">{b}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
              <VStack gap="3" minW="180px">
                <Button
                  colorPalette="green"
                  size="lg"
                  w="full"
                  onClick={() => navigate("/packages")}
                >
                  <LuPackage />
                  View Packages
                  <LuArrowRight />
                </Button>
                <Text fontSize="xs" color="fg.muted" textAlign="center">
                  Packages start from just $5
                </Text>
              </VStack>
            </Flex>
          </Box>
        )}

        {/* Social proof strip */}
        <SimpleGrid columns={3} gap="3">
          {SOCIAL_PROOF.map(({ stat, label }) => (
            <Box
              key={label}
              bg="bg.panel"
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
              p="4"
              textAlign="center"
            >
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="extrabold" color="green.400">
                {stat}
              </Text>
              <Text fontSize="xs" color="fg.muted" mt="0.5">{label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Live Withdrawal Ticker */}
        <LiveWithdrawalTicker />

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
                  borderColor={isLocked ? "border" : "border"}
                  p="4"
                  cursor={isLocked ? "not-allowed" : "pointer"}
                  position="relative"
                  overflow="hidden"
                  opacity={isLocked ? 0.55 : 1}
                  _hover={isLocked ? {} : { borderColor: "green.500/40", bg: "bg.subtle" }}
                  transition="all 0.15s"
                  onClick={() => {
                    if (isLocked) {
                      setShowModal(true)
                    } else {
                      const task = SAMPLE_TASKS.find((t) => t.categoryId === cat.id) || SAMPLE_TASKS[0]
                      navigate(`/tasks/${task.id}`)
                    }
                  }}
                >
                  {isLocked && (
                    <Box position="absolute" top="2" right="2" color="fg.muted">
                      <LuLock size={14} />
                    </Box>
                  )}
                  <VStack align="start" gap="2">
                    <Box
                      w="9" h="9" borderRadius="lg"
                      bg="green.500/15"
                      display="flex" alignItems="center" justifyContent="center"
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
