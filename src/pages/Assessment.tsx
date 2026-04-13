import { useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Flex,
  Badge,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { LuZap, LuChevronRight, LuCircleCheck } from "react-icons/lu"
import { ONBOARDING_ASSESSMENT } from "@/lib/assessment-data"
import { STORAGE_KEYS } from "@/lib/constants"
import type { AssessmentResult } from "@/types/assessment"
import { useAuthStore } from "@/store/auth-store"
import { ProgressRoot, ProgressBar } from "@/components/ui/progress"

export default function AssessmentPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null)
  const [arrangedWords, setArrangedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])

  const questions = ONBOARDING_ASSESSMENT.questions
  const currentQuestion = questions[currentIndex]
  const total = questions.length
  const progress = ((currentIndex + 1) / total) * 100

  const handleSelectOption = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleWordClick = (word: string, fromArranged: boolean) => {
    if (fromArranged) {
      const newArranged = arrangedWords.filter((w) => w !== word)
      setArrangedWords(newArranged)
      setAvailableWords((prev) => [...prev, word])
      setSelectedAnswer(newArranged.join(" ") || null)
    } else {
      const newArranged = [...arrangedWords, word]
      setArrangedWords(newArranged)
      setAvailableWords((prev) => prev.filter((w) => w !== word))
      setSelectedAnswer(newArranged.join(" "))
    }
  }

  const initArrangeWords = () => {
    if (currentQuestion.type === "arrange_words" && currentQuestion.sequence) {
      const shuffled = [...currentQuestion.sequence].sort(() => Math.random() - 0.5)
      setAvailableWords(shuffled)
      setArrangedWords([])
    }
  }

  const handleNext = () => {
    if (selectedAnswer === null && currentQuestion.type !== "arrange_words") return
    if (currentQuestion.type === "arrange_words" && arrangedWords.length === 0) return

    const finalAnswer = currentQuestion.type === "arrange_words"
      ? arrangedWords.join(" ")
      : selectedAnswer as number

    const newAnswers = { ...answers, [currentQuestion.id]: finalAnswer }
    setAnswers(newAnswers)

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setArrangedWords([])
      setAvailableWords([])

      const nextQ = questions[currentIndex + 1]
      if (nextQ.type === "arrange_words" && nextQ.sequence) {
        const shuffled = [...nextQ.sequence].sort(() => Math.random() - 0.5)
        setAvailableWords(shuffled)
      }
    } else {
      // Calculate score
      let correct = 0
      const allAnswers = newAnswers

      questions.forEach((q) => {
        const answer = allAnswers[q.id]
        if (q.type === "arrange_words") {
          if (answer === q.correctAnswer) correct++
        } else {
          if (answer === q.correctIndex) correct++
        }
      })

      const score = Math.round((correct / total) * 100)
      const passed = score >= ONBOARDING_ASSESSMENT.passPercentage

      const result: AssessmentResult = {
        assessmentId: ONBOARDING_ASSESSMENT.id,
        userId: user?.id || "unknown",
        score,
        totalQuestions: total,
        passed,
        completedAt: new Date().toISOString(),
        answers: newAnswers,
      }

      localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(result))
      navigate("/assessment/result")
    }
  }

  // Initialize arrange words for first question if needed
  if (
    currentQuestion.type === "arrange_words" &&
    availableWords.length === 0 &&
    arrangedWords.length === 0 &&
    currentQuestion.sequence
  ) {
    const shuffled = [...currentQuestion.sequence].sort(() => Math.random() - 0.5)
    setAvailableWords(shuffled)
  }

  const isAnswered = () => {
    if (currentQuestion.type === "arrange_words") {
      return arrangedWords.length > 0
    }
    return selectedAnswer !== null
  }

  return (
    <Box bg="bg" minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box
        bg="bg.panel"
        borderBottom="1px solid"
        borderColor="border"
        px="6"
        py="4"
      >
        <Flex align="center" justify="space-between" maxW="700px" mx="auto">
          <HStack gap="2">
            <Box bg="green.500" borderRadius="md" p="1" color="white">
              <LuZap size={16} />
            </Box>
            <Text fontWeight="bold" color="fg">Remotask Assessment</Text>
          </HStack>
          <Badge colorPalette="green" variant="subtle" px="3" py="1">
            Question {currentIndex + 1} of {total}
          </Badge>
        </Flex>
        <Box maxW="700px" mx="auto" mt="3">
          <ProgressRoot value={progress} colorPalette="green" size="sm" borderRadius="full">
            <ProgressBar />
          </ProgressRoot>
        </Box>
      </Box>

      {/* Question Card */}
      <Flex flex="1" align="center" justify="center" p="4" py="8">
        <Box w="full" maxW="700px">
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            p={{ base: "6", md: "8" }}
          >
            {/* Question Type Badge */}
            <Badge
              colorPalette="green"
              variant="subtle"
              mb="4"
              textTransform="capitalize"
              px="3"
              py="1"
            >
              {currentQuestion.type.replace(/_/g, " ")}
            </Badge>

            {/* Question Prompt */}
            <Heading size="md" color="fg" mb="6" lineHeight="relaxed">
              {currentQuestion.prompt}
            </Heading>

            {/* Multiple Choice */}
            {(currentQuestion.type === "multiple_choice" || currentQuestion.type === "classification") && (
              <VStack gap="3">
                {currentQuestion.options?.map((option, i) => (
                  <Box
                    key={i}
                    w="full"
                    p="4"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={selectedAnswer === i ? "green.500" : "border"}
                    bg={selectedAnswer === i ? "green.500/10" : "bg.subtle"}
                    cursor="pointer"
                    onClick={() => handleSelectOption(i)}
                    _hover={{
                      borderColor: selectedAnswer === i ? "green.500" : "green.500/40",
                      bg: selectedAnswer === i ? "green.500/10" : "bg.muted",
                    }}
                    transition="all 0.15s"
                  >
                    <HStack gap="3">
                      <Box
                        w="6"
                        h="6"
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
                            <LuCircleCheck size={12} />
                          </Box>
                        )}
                      </Box>
                      <Text
                        color={selectedAnswer === i ? "fg" : "fg.muted"}
                        fontWeight={selectedAnswer === i ? "semibold" : "normal"}
                      >
                        {option}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}

            {/* Arrange Words */}
            {currentQuestion.type === "arrange_words" && (
              <VStack gap="4">
                {/* Arranged sentence area */}
                <Box
                  w="full"
                  minH="60px"
                  bg="bg.subtle"
                  borderRadius="xl"
                  border="2px dashed"
                  borderColor={arrangedWords.length > 0 ? "green.500/50" : "border"}
                  p="3"
                  display="flex"
                  flexWrap="wrap"
                  gap="2"
                  alignItems="center"
                >
                  {arrangedWords.length === 0 ? (
                    <Text color="fg.muted" fontSize="sm">Click words below to build your sentence...</Text>
                  ) : (
                    arrangedWords.map((word, i) => (
                      <Box
                        key={i}
                        bg="green.500"
                        color="white"
                        px="3"
                        py="1"
                        borderRadius="lg"
                        fontSize="sm"
                        fontWeight="semibold"
                        cursor="pointer"
                        onClick={() => handleWordClick(word, true)}
                        _hover={{ bg: "green.600" }}
                      >
                        {word}
                      </Box>
                    ))
                  )}
                </Box>

                {/* Available words */}
                <Box w="full">
                  <Text fontSize="xs" color="fg.muted" mb="2">Available words:</Text>
                  <Flex flexWrap="wrap" gap="2">
                    {availableWords.map((word, i) => (
                      <Box
                        key={i}
                        bg="bg.muted"
                        border="1px solid"
                        borderColor="border"
                        color="fg"
                        px="3"
                        py="1.5"
                        borderRadius="lg"
                        fontSize="sm"
                        fontWeight="medium"
                        cursor="pointer"
                        onClick={() => handleWordClick(word, false)}
                        _hover={{ bg: "bg.subtle", borderColor: "green.500/40" }}
                        transition="all 0.1s"
                      >
                        {word}
                      </Box>
                    ))}
                  </Flex>
                </Box>

                {arrangedWords.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    colorPalette="red"
                    onClick={() => {
                      if (currentQuestion.sequence) {
                        setAvailableWords([...arrangedWords, ...availableWords])
                        setArrangedWords([])
                        setSelectedAnswer(null)
                      }
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </VStack>
            )}

            {/* Pattern */}
            {currentQuestion.type === "pattern" && (
              <VStack gap="3">
                {currentQuestion.options?.map((option, i) => (
                  <Box
                    key={i}
                    w="full"
                    p="4"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={selectedAnswer === i ? "green.500" : "border"}
                    bg={selectedAnswer === i ? "green.500/10" : "bg.subtle"}
                    cursor="pointer"
                    onClick={() => handleSelectOption(i)}
                    _hover={{
                      borderColor: selectedAnswer === i ? "green.500" : "green.500/40",
                      bg: selectedAnswer === i ? "green.500/10" : "bg.muted",
                    }}
                    transition="all 0.15s"
                    textAlign="center"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color={selectedAnswer === i ? "green.400" : "fg"}
                    >
                      {option}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}

            {/* Sentiment */}
            {currentQuestion.type === "sentiment" && (
              <VStack gap="3">
                {currentQuestion.options?.map((option, i) => {
                  const colors = ["red.500", "orange.500", "yellow.500", "teal.500", "green.500"]
                  const bgColors = ["red.500/10", "orange.500/10", "yellow.500/10", "teal.500/10", "green.500/10"]
                  const isSelected = selectedAnswer === i
                  return (
                    <Box
                      key={i}
                      w="full"
                      p="4"
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={isSelected ? colors[i] : "border"}
                      bg={isSelected ? bgColors[i] : "bg.subtle"}
                      cursor="pointer"
                      onClick={() => handleSelectOption(i)}
                      _hover={{
                        borderColor: isSelected ? colors[i] : "border",
                        bg: isSelected ? bgColors[i] : "bg.muted",
                      }}
                      transition="all 0.15s"
                    >
                      <HStack justify="space-between">
                        <Text
                          color={isSelected ? colors[i] : "fg.muted"}
                          fontWeight={isSelected ? "semibold" : "normal"}
                        >
                          {option}
                        </Text>
                        <Text fontSize="lg">
                          {["😡", "😟", "😐", "🙂", "😄"][i]}
                        </Text>
                      </HStack>
                    </Box>
                  )
                })}
              </VStack>
            )}

            {/* Next Button */}
            <Button
              mt="8"
              colorPalette="green"
              size="lg"
              w="full"
              disabled={!isAnswered()}
              onClick={handleNext}
            >
              {currentIndex < total - 1 ? (
                <>
                  Next Question
                  <LuChevronRight />
                </>
              ) : (
                "Submit Assessment"
              )}
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
