import { useState, useEffect } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Flex,
  Spinner,
} from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"
import {
  LuArrowLeft,
  LuCircleCheck,
  LuClock,
  LuZap,
  LuTrophy,
  LuArrowRight,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { useAuthStore } from "@/store/auth-store"
import { useTaskStore } from "@/store/task-store"
import { useWalletStore } from "@/store/wallet-store"
import { fetchTasks } from "@/lib/api"
import type { Task, TaskQuestion } from "@/types/tasks"
import { formatCurrency } from "@/lib/formatters"
import { toaster } from "@/components/ui/toaster"
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog"
import { ProgressRoot, ProgressBar } from "@/components/ui/progress"

export default function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { isTaskCompleted, markTaskComplete } = useTaskStore()
  const { addEarnings } = useWalletStore()
  const [task, setTask] = useState<Task | null | undefined>(undefined)

  useEffect(() => {
    fetchTasks()
      .then((tasks) => {
        const found = tasks.find((t) => t.id === taskId)
        setTask(found || null)
      })
      .catch(() => setTask(null))
  }, [taskId])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState(0)

  if (task === undefined) {
    return (
      <AppShell>
        <Box textAlign="center" py="16">
          <Spinner color="green.400" size="lg" />
          <Text color="fg.muted" mt="3">Loading task...</Text>
        </Box>
      </AppShell>
    )
  }

  if (task === null) {
    return (
      <AppShell>
        <Box textAlign="center" py="16">
          <Heading size="md" color="fg" mb="3">Task Not Found</Heading>
          <Text color="fg.muted" mb="4">The task you're looking for doesn't exist.</Text>
          <Button colorPalette="green" onClick={() => navigate("/tasks")}>
            Back to Tasks
          </Button>
        </Box>
      </AppShell>
    )
  }

  const alreadyCompleted = isTaskCompleted(task.id)

  // Flatten all questions
  const allQuestions: TaskQuestion[] = task.topics.flatMap((topic) => topic.questions)
  const total = allQuestions.length
  const currentQuestion = allQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / total) * 100

  if (alreadyCompleted) {
    return (
      <AppShell>
        <Box maxW="600px" mx="auto">
          <Button
            variant="ghost"
            size="sm"
            mb="6"
            onClick={() => navigate("/tasks")}
            px="2"
          >
            <LuArrowLeft />
            Back to Tasks
          </Button>
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="2px solid"
            borderColor="green.500/40"
            p="8"
            textAlign="center"
          >
            <VStack gap="4">
              <Box
                w="16"
                h="16"
                borderRadius="full"
                bg="green.500/15"
                border="2px solid"
                borderColor="green.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.400"
              >
                <LuCircleCheck size={32} />
              </Box>
              <VStack gap="1">
                <Heading size="lg" color="fg">Task Already Completed</Heading>
                <Text color="fg.muted">
                  You have already completed the "{task.categoryName}" task.
                </Text>
              </VStack>
              <Badge colorPalette="green" variant="subtle" px="4" py="2" fontSize="md">
                Earned: {formatCurrency(task.totalReward)}
              </Badge>
              <Button colorPalette="green" onClick={() => navigate("/tasks")}>
                Browse More Tasks
              </Button>
            </VStack>
          </Box>
        </Box>
      </AppShell>
    )
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer }
    setAnswers(newAnswers)

    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      // Complete task
      let correct = 0
      allQuestions.forEach((q) => {
        if (newAnswers[q.id] === q.question.answerIndex) correct++
      })

      const earned = task.totalReward
      setEarnedAmount(earned)

      if (user) {
        markTaskComplete(user.id, task.id, correct, total, earned, newAnswers)
        addEarnings(earned, "task", task.id, `Completed: ${task.categoryName}`)
      }

      setShowCompletion(true)
    }
  }

  return (
    <AppShell>
      <Box maxW="700px" mx="auto">
        {/* Header */}
        <HStack justify="space-between" mb="6" wrap="wrap" gap="3">
          <HStack gap="3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")} px="2">
              <LuArrowLeft />
              Tasks
            </Button>
            <Box>
              <Heading size="md" color="fg">{task.categoryName}</Heading>
              <HStack gap="3" mt="1">
                <HStack gap="1">
                  <LuClock size={12} color="var(--chakra-colors-fg-muted)" />
                  <Text fontSize="xs" color="fg.muted">{task.estimatedTimeMinutes} min</Text>
                </HStack>
                <Badge
                  colorPalette={task.difficulty === "easy" ? "green" : task.difficulty === "medium" ? "yellow" : "red"}
                  variant="subtle"
                  size="sm"
                  textTransform="capitalize"
                >
                  {task.difficulty}
                </Badge>
              </HStack>
            </Box>
          </HStack>
          <HStack gap="1">
            <LuZap size={14} color="var(--chakra-colors-green-400)" />
            <Text fontWeight="bold" color="green.400" fontSize="lg">
              {formatCurrency(task.totalReward)}
            </Text>
          </HStack>
        </HStack>

        {/* Progress */}
        <Box mb="6">
          <HStack justify="space-between" mb="2">
            <Text fontSize="sm" color="fg.muted">
              Question {currentQuestionIndex + 1} of {total}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {Math.round(progress)}% complete
            </Text>
          </HStack>
          <ProgressRoot value={progress} colorPalette="green" size="sm" borderRadius="full">
            <ProgressBar />
          </ProgressRoot>
        </Box>

        {/* Question Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p={{ base: "5", md: "8" }}
        >
          <HStack justify="space-between" mb="5">
            <Badge colorPalette="green" variant="subtle" size="sm">
              Q{currentQuestionIndex + 1}
            </Badge>
            <HStack gap="1">
              <LuZap size={12} color="var(--chakra-colors-green-400)" />
              <Text fontSize="sm" color="green.400" fontWeight="semibold">
                +{formatCurrency(currentQuestion.amount)}
              </Text>
            </HStack>
          </HStack>

          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="semibold"
            color="fg"
            mb="6"
            lineHeight="relaxed"
          >
            {currentQuestion.question.question}
          </Text>

          <VStack gap="3">
            {currentQuestion.question.answers.map((answer, i) => (
              <Box
                key={i}
                w="full"
                p="4"
                borderRadius="xl"
                border="2px solid"
                borderColor={selectedAnswer === i ? "green.500" : "border"}
                bg={selectedAnswer === i ? "green.500/10" : "bg.subtle"}
                cursor="pointer"
                onClick={() => handleSelectAnswer(i)}
                _hover={{
                  borderColor: selectedAnswer === i ? "green.500" : "green.500/40",
                  bg: selectedAnswer === i ? "green.500/10" : "bg.muted",
                }}
                transition="all 0.15s"
              >
                <HStack gap="3">
                  <Box
                    w="7"
                    h="7"
                    borderRadius="full"
                    border="2px solid"
                    borderColor={selectedAnswer === i ? "green.500" : "border"}
                    bg={selectedAnswer === i ? "green.500" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {selectedAnswer === i && (
                      <Box color="white" display="flex">
                        <LuCircleCheck size={14} />
                      </Box>
                    )}
                  </Box>
                  <Text
                    color={selectedAnswer === i ? "fg" : "fg.muted"}
                    fontWeight={selectedAnswer === i ? "semibold" : "normal"}
                    fontSize="sm"
                  >
                    {answer}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Button
            mt="6"
            colorPalette="green"
            size="lg"
            w="full"
            disabled={selectedAnswer === null}
            onClick={handleNext}
          >
            {currentQuestionIndex < total - 1 ? (
              <>
                Next
                <LuArrowRight />
              </>
            ) : (
              <>
                <LuCircleCheck />
                Submit Task
              </>
            )}
          </Button>
        </Box>

        {/* Completion Modal */}
        <DialogRoot open={showCompletion} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle srOnly>Task Completed</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <VStack gap="6" textAlign="center" py="4">
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
                  <LuTrophy size={36} />
                </Box>
                <VStack gap="1">
                  <Heading size="xl" color="fg">Task Complete!</Heading>
                  <Text color="fg.muted">
                    Great work on the {task.categoryName} task!
                  </Text>
                </VStack>
                <Box
                  bg="green.500/10"
                  border="1px solid"
                  borderColor="green.500/30"
                  borderRadius="2xl"
                  px="8"
                  py="4"
                  w="full"
                >
                  <Text fontSize="sm" color="fg.muted" mb="1">You Earned</Text>
                  <HStack justify="center" gap="2">
                    <LuZap size={20} color="var(--chakra-colors-green-400)" />
                    <Text fontSize="3xl" fontWeight="extrabold" color="green.400">
                      {formatCurrency(earnedAmount)}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="fg.muted" mt="1">Added to your wallet</Text>
                </Box>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <VStack gap="2" w="full">
                <Button
                  colorPalette="green"
                  size="lg"
                  w="full"
                  onClick={() => navigate("/tasks")}
                >
                  Continue to Tasks
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate("/earnings")}
                >
                  View Earnings
                </Button>
              </VStack>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </AppShell>
  )
}
