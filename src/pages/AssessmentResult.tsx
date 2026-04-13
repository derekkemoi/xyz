import { useEffect, useState } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { LuZap, LuTrophy, LuCircleX, LuRefreshCw, LuLayoutDashboard } from "react-icons/lu"
import { toaster } from "@/components/ui/toaster"
import { useWalletStore } from "@/store/wallet-store"
import { useAuthStore } from "@/store/auth-store"
import { STORAGE_KEYS, WELCOME_BONUS_AMOUNT } from "@/lib/constants"
import type { AssessmentResult } from "@/types/assessment"
import { formatPercentage } from "@/lib/formatters"

export default function AssessmentResultPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { awardWelcomeBonus } = useWalletStore()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [bonusAwarded, setBonusAwarded] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENT)
    if (!raw) {
      navigate("/assessment")
      return
    }
    try {
      const data: AssessmentResult = JSON.parse(raw)
      setResult(data)

      if (data.passed && user) {
        const awarded = awardWelcomeBonus(user.id)
        if (awarded) {
          setBonusAwarded(true)
          toaster.create({
            title: "Welcome Bonus Awarded!",
            description: `$${WELCOME_BONUS_AMOUNT} has been added to your wallet.`,
            type: "success",
          })
        }
      }
    } catch {
      navigate("/assessment")
    }
  }, [])

  if (!result) return null

  const scorePercent = Math.round((result.score / result.totalQuestions) * 100)

  const handleRetry = () => {
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT)
    navigate("/assessment")
  }

  return (
    <Box bg="bg" minH="100vh" display="flex" flexDirection="column">
      {/* Header */}
      <Box bg="bg.panel" borderBottom="1px solid" borderColor="border" px="6" py="4">
        <HStack gap="2" maxW="600px" mx="auto">
          <Box bg="green.500" borderRadius="md" p="1" color="white">
            <LuZap size={16} />
          </Box>
          <Text fontWeight="bold" color="fg">Remotask Assessment</Text>
        </HStack>
      </Box>

      <Flex flex="1" align="center" justify="center" p="4" py="12">
        <Box w="full" maxW="500px">
          {result.passed ? (
            // PASSED STATE
            <Box
              bg="bg.panel"
              borderRadius="2xl"
              border="2px solid"
              borderColor="green.500/40"
              p={{ base: "6", md: "10" }}
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="120px"
                background="radial-gradient(ellipse at top, rgba(34,197,94,0.2) 0%, transparent 70%)"
                pointerEvents="none"
              />

              <VStack gap="6" position="relative">
                <Box
                  w="20"
                  h="20"
                  borderRadius="full"
                  bg="green.500/20"
                  border="2px solid"
                  borderColor="green.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="green.400"
                >
                  <LuTrophy size={36} />
                </Box>

                <VStack gap="2">
                  <Heading size="2xl" color="fg" fontWeight="extrabold">
                    Congratulations!
                  </Heading>
                  <Text color="fg.muted" fontSize="lg">
                    You passed the assessment!
                  </Text>
                </VStack>

                {/* Score */}
                <Box
                  bg="green.500/10"
                  border="1px solid"
                  borderColor="green.500/30"
                  borderRadius="2xl"
                  px="8"
                  py="5"
                  w="full"
                >
                  <Text color="fg.muted" fontSize="sm" mb="1">Your Score</Text>
                  <Text fontSize="4xl" fontWeight="extrabold" color="green.400">
                    {formatPercentage(scorePercent)}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {result.score} correct out of {result.totalQuestions} questions
                  </Text>
                </Box>

                {/* Bonus */}
                {bonusAwarded && (
                  <Box
                    bg="green.500/10"
                    border="1px solid"
                    borderColor="green.500/30"
                    borderRadius="xl"
                    px="6"
                    py="4"
                    w="full"
                  >
                    <HStack justify="center" gap="2">
                      <LuZap size={18} color="var(--chakra-colors-green-400)" />
                      <Text color="green.400" fontWeight="bold" fontSize="lg">
                        +${WELCOME_BONUS_AMOUNT} Welcome Bonus Awarded!
                      </Text>
                    </HStack>
                    <Text color="fg.muted" fontSize="sm" mt="1" textAlign="center">
                      Added to your wallet
                    </Text>
                  </Box>
                )}

                <Text color="fg.muted" fontSize="sm" textAlign="center">
                  You are now qualified to work on AI training tasks and start earning.
                </Text>

                <Button
                  colorPalette="green"
                  size="lg"
                  w="full"
                  onClick={() => navigate("/dashboard")}
                >
                  <LuLayoutDashboard />
                  Go to Dashboard
                </Button>
              </VStack>
            </Box>
          ) : (
            // FAILED STATE
            <Box
              bg="bg.panel"
              borderRadius="2xl"
              border="2px solid"
              borderColor="red.500/30"
              p={{ base: "6", md: "10" }}
              textAlign="center"
            >
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
                  <LuCircleX size={36} />
                </Box>

                <VStack gap="2">
                  <Heading size="2xl" color="fg" fontWeight="extrabold">
                    Not Quite There
                  </Heading>
                  <Text color="fg.muted" fontSize="lg">
                    You need 60% to pass the assessment
                  </Text>
                </VStack>

                <Box
                  bg="bg.subtle"
                  border="1px solid"
                  borderColor="border"
                  borderRadius="2xl"
                  px="8"
                  py="5"
                  w="full"
                >
                  <Text color="fg.muted" fontSize="sm" mb="1">Your Score</Text>
                  <Text fontSize="4xl" fontWeight="extrabold" color="red.400">
                    {formatPercentage(scorePercent)}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {result.score} correct out of {result.totalQuestions} questions
                  </Text>
                  <Box mt="3" h="2" bg="bg.muted" borderRadius="full" overflow="hidden">
                    <Box
                      h="full"
                      bg="red.500"
                      borderRadius="full"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </Box>
                  <HStack justify="space-between" mt="1">
                    <Text fontSize="xs" color="fg.muted">0%</Text>
                    <Text fontSize="xs" color="fg.muted">Pass: 60%</Text>
                    <Text fontSize="xs" color="fg.muted">100%</Text>
                  </HStack>
                </Box>

                <Text color="fg.muted" fontSize="sm" textAlign="center">
                  Don't worry! Review the questions and try again. There's no limit on retries.
                </Text>

                <Button
                  colorPalette="green"
                  size="lg"
                  w="full"
                  onClick={handleRetry}
                >
                  <LuRefreshCw />
                  Try Again
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
