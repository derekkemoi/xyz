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
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuLock,
  LuArrowRight,
  LuCircleCheck,
  LuClock,
  LuZap,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useTaskStore } from "@/store/task-store"
import { fetchTasks } from "@/lib/api"
import type { Task } from "@/types/tasks"
import { formatCurrency } from "@/lib/formatters"

export default function TasksPage() {
  const navigate = useNavigate()
  const { activePackage } = useSubscriptionStore()
  const { isTaskCompleted } = useTaskStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data)
        setIsLoading(false)
      })
      .catch(() => {
        setError("Failed to load tasks. Please refresh.")
        setIsLoading(false)
      })
  }, [])

  const handleCategoryClick = (task: Task) => {
    if (!activePackage) return
    navigate(`/tasks/${task.id}`)
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" color="fg" mb="1">Task Marketplace</Heading>
          <Text color="fg.muted">
            {activePackage
              ? `You have access to all task categories with your ${activePackage.name} plan`
              : "Activate a package to unlock all task categories"}
          </Text>
        </Box>

        {/* No Package Banner */}
        {!activePackage && (
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
                <LuLock size={32} />
              </Box>
              <VStack gap="1">
                <Text fontWeight="bold" color="fg" fontSize="lg">Tasks Locked</Text>
                <Text color="fg.muted" fontSize="sm" maxW="sm">
                  You need an active package subscription to access and complete tasks.
                  Activate a package to start earning.
                </Text>
              </VStack>
              <Button colorPalette="green" size="md" onClick={() => navigate("/packages")}>
                View Packages
                <LuArrowRight />
              </Button>
            </VStack>
          </Box>
        )}

        {/* Stats Row */}
        {activePackage && (
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
            <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Tasks Today</Text>
                <Text fontSize="xl" fontWeight="bold" color="fg">{activePackage.tasksPerDay}</Text>
              </VStack>
            </Box>
            <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Daily Earnings</Text>
                <Text fontSize="xl" fontWeight="bold" color="green.400">{formatCurrency(activePackage.dailyEarnings)}</Text>
              </VStack>
            </Box>
            <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Categories</Text>
                <Text fontSize="xl" fontWeight="bold" color="fg">{isLoading ? "—" : tasks.length}</Text>
              </VStack>
            </Box>
            <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4">
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="fg.muted" textTransform="uppercase" fontWeight="medium">Per Task</Text>
                <Text fontSize="xl" fontWeight="bold" color="fg">
                  {formatCurrency(activePackage.pricePerTask.min)}–{formatCurrency(activePackage.pricePerTask.max)}
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        )}

        {/* Loading */}
        {isLoading && (
          <Box textAlign="center" py="12">
            <Spinner color="green.400" size="lg" />
            <Text color="fg.muted" mt="3" fontSize="sm">Loading tasks...</Text>
          </Box>
        )}

        {/* Error */}
        {error && !isLoading && (
          <Box
            bg="red.500/10"
            border="1px solid"
            borderColor="red.500/30"
            borderRadius="xl"
            p="4"
            textAlign="center"
          >
            <Text color="red.400">{error}</Text>
            <Button
              mt="3"
              size="sm"
              colorPalette="red"
              variant="ghost"
              onClick={() => {
                setIsLoading(true)
                setError(null)
                fetchTasks()
                  .then((data) => { setTasks(data); setIsLoading(false) })
                  .catch(() => { setError("Failed to load tasks. Please refresh."); setIsLoading(false) })
              }}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Task Categories Grid */}
        {!isLoading && !error && (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="4">
            {tasks.map((task) => {
              const isLocked = !activePackage
              const isCompleted = isTaskCompleted(task.id)

              return (
                <Box
                  key={task.id}
                  bg="bg.panel"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={isCompleted ? "green.500/40" : "border"}
                  p="5"
                  cursor={isLocked ? "not-allowed" : "pointer"}
                  position="relative"
                  opacity={isLocked ? 0.6 : 1}
                  _hover={isLocked ? {} : {
                    borderColor: "green.500/50",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.15s"
                  onClick={() => handleCategoryClick(task)}
                >
                  <HStack justify="space-between" mb="3">
                    <Box
                      w="10"
                      h="10"
                      borderRadius="xl"
                      bg={isCompleted ? "green.500/20" : "green.500/10"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="green.400"
                    >
                      <LuZap size={20} />
                    </Box>
                    {isCompleted ? (
                      <Badge colorPalette="green" variant="subtle" size="sm">
                        <LuCircleCheck size={10} />
                        Completed
                      </Badge>
                    ) : isLocked ? (
                      <Box color="fg.muted">
                        <LuLock size={16} />
                      </Box>
                    ) : null}
                  </HStack>

                  <VStack align="start" gap="1">
                    <Text fontWeight="bold" color="fg">{task.categoryName}</Text>
                    <Text fontSize="sm" color="fg.muted" lineHeight="relaxed">
                      {task.description}
                    </Text>
                  </VStack>

                  <HStack justify="space-between" mt="4">
                    <HStack gap="1">
                      <LuClock size={12} color="var(--chakra-colors-fg-muted)" />
                      <Text fontSize="xs" color="fg.muted">{task.totalQuestions} questions</Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="bold" color="green.400">
                      ~{formatCurrency(task.totalReward)}
                    </Text>
                  </HStack>
                </Box>
              )
            })}
          </SimpleGrid>
        )}
      </VStack>
    </AppShell>
  )
}
