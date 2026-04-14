import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Flex,
  Badge,
  List,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuZap,
  LuChevronRight,
  LuClock,
  LuPen,
  LuAlignLeft,
  LuTag,
  LuDatabase,
  LuBrainCircuit,
  LuCircleCheck,
} from "react-icons/lu"

const SKILLS = [
  { icon: LuPen, label: "Text annotation & labeling" },
  { icon: LuAlignLeft, label: "Sentence arrangement" },
  { icon: LuTag, label: "Content classification" },
  { icon: LuDatabase, label: "Data categorization" },
  { icon: LuBrainCircuit, label: "Pattern recognition" },
]

export default function AssessmentWelcomePage() {
  const navigate = useNavigate()

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
        <HStack gap="2" maxW="600px" mx="auto">
          <Box bg="green.500" borderRadius="md" p="1" color="white">
            <LuZap size={16} />
          </Box>
          <Text fontWeight="bold" color="fg">Remotask Assessment</Text>
        </HStack>
      </Box>

      <Flex flex="1" align="center" justify="center" p="4" py="10">
        <Box w="full" maxW="560px">
          <Box
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            p={{ base: "6", md: "10" }}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative gradient */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              h="160px"
              background="radial-gradient(ellipse at top, rgba(34,197,94,0.15) 0%, transparent 70%)"
              pointerEvents="none"
            />

            <VStack gap="8" position="relative">
              {/* Icon */}
              <Box
                w="20"
                h="20"
                borderRadius="full"
                bg="green.500/15"
                border="2px solid"
                borderColor="green.500/40"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="green.400"
              >
                <LuBrainCircuit size={36} />
              </Box>

              {/* Title & description */}
              <VStack gap="3" textAlign="center">
                <Heading
                  size="xl"
                  color="fg"
                  fontWeight="extrabold"
                  lineHeight="tight"
                >
                  Welcome to AI Training Assessment
                </Heading>
                <Text color="fg.muted" fontSize="md" maxW="sm">
                  Complete this quick assessment to verify your skills and unlock access to paid AI training tasks.
                </Text>
              </VStack>

              {/* Skills list */}
              <Box
                w="full"
                bg="bg.subtle"
                border="1px solid"
                borderColor="border"
                borderRadius="xl"
                p="5"
              >
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb="4"
                >
                  Skills Being Assessed
                </Text>
                <List.Root gap="3" listStyle="none" ps="0">
                  {SKILLS.map(({ icon: Icon, label }) => (
                    <List.Item key={label}>
                      <HStack gap="3">
                        <Box
                          w="8"
                          h="8"
                          borderRadius="lg"
                          bg="green.500/10"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="green.400"
                          flexShrink={0}
                        >
                          <Icon size={15} />
                        </Box>
                        <Text fontSize="sm" color="fg" fontWeight="medium">
                          {label}
                        </Text>
                        <Box ml="auto" color="green.500">
                          <LuCircleCheck size={16} />
                        </Box>
                      </HStack>
                    </List.Item>
                  ))}
                </List.Root>
              </Box>

              {/* Time note */}
              <HStack
                gap="2"
                bg="green.500/8"
                border="1px solid"
                borderColor="green.500/20"
                borderRadius="full"
                px="5"
                py="2.5"
              >
                <Box color="green.400">
                  <LuClock size={15} />
                </Box>
                <Text fontSize="sm" color="green.300" fontWeight="medium">
                  This will take 2–3 minutes
                </Text>
              </HStack>

              {/* CTA */}
              <Button
                colorPalette="green"
                size="lg"
                w="full"
                onClick={() => navigate("/assessment/start")}
              >
                Start Assessment
                <LuChevronRight />
              </Button>

              <Text fontSize="xs" color="fg.subtle" textAlign="center">
                5 questions • Multiple choice • Instant results
              </Text>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
