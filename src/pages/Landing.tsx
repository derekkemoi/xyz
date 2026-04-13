import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Container,
  Stack,
  Badge,
  Separator,
  Icon,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Accordion } from "@chakra-ui/react"
import {
  LuZap,
  LuArrowRight,
  LuShield,
  LuClock,
  LuBanknote,
  LuUsers,
  LuCircleCheck,
  LuStar,
  LuTrendingUp,
  LuGlobe,
  LuChevronDown,
} from "react-icons/lu"
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@/components/ui/accordion"

const PACKAGES = [
  {
    name: "Beginner",
    price: "$240",
    period: "/month",
    daily: "$8",
    tasks: "10 tasks/day",
    perTask: "$0.50 – $1.20",
    color: "blue",
    features: ["10 tasks per day", "$0.50 - $1.20 per task", "Mobile & desktop access", "Basic support"],
  },
  {
    name: "Average Skilled",
    price: "$650",
    period: "/month",
    daily: "$22",
    tasks: "15 tasks/day",
    perTask: "$1.20 – $2.80",
    color: "purple",
    features: ["15 tasks per day", "$1.20 - $2.80 per task", "Priority support", "All task categories"],
  },
  {
    name: "Expert",
    price: "$2,250",
    period: "/month",
    daily: "$75",
    tasks: "25 tasks/day",
    perTask: "$2.50 – $5.00",
    color: "green",
    popular: true,
    features: ["25 tasks per day", "$2.50 - $5.00 per task", "Priority support", "Advanced tasks", "Bonus rewards"],
  },
  {
    name: "Elite",
    price: "$6,000",
    period: "/month",
    daily: "$200",
    tasks: "40 tasks/day",
    perTask: "$4.00 – $8.00",
    color: "orange",
    features: ["40 tasks per day", "$4.00 - $8.00 per task", "24/7 VIP support", "Premium tasks", "Monthly bonuses", "Exclusive access"],
  },
]

const STEPS = [
  { number: "1", title: "Sign Up", description: "Create your free account in under 2 minutes" },
  { number: "2", title: "Take Assessment", description: "Complete a short skills evaluation to qualify" },
  { number: "3", title: "Choose Package", description: "Pick a subscription plan that fits your goals" },
  { number: "4", title: "Complete Tasks", description: "Work on AI training tasks from home" },
  { number: "5", title: "Earn Money", description: "Get paid instantly via M-PESA or bank transfer" },
]

const BENEFITS = [
  {
    icon: LuGlobe,
    title: "100% Remote Work",
    description: "Work from anywhere in the world. All you need is a smartphone or computer and internet.",
  },
  {
    icon: LuClock,
    title: "Flexible Hours",
    description: "Set your own schedule. Work as much or as little as you want, whenever you want.",
  },
  {
    icon: LuBanknote,
    title: "Instant Payments",
    description: "Withdraw earnings directly to M-PESA or your bank. Payouts processed within 24-72 hours.",
  },
  {
    icon: LuShield,
    title: "Trusted Platform",
    description: "Join over 1,000 active workers earning daily on our secure and transparent platform.",
  },
]

const FAQS = [
  {
    q: "What is Remotask?",
    a: "Remotask is a platform that connects remote workers with AI companies that need help training their artificial intelligence models. You complete simple tasks like labeling data, transcribing audio, and classifying content.",
  },
  {
    q: "Do I need any technical experience?",
    a: "No! Our tasks are designed for everyone. You just need to understand basic instructions and have a reliable internet connection. We provide all the training you need through our assessment process.",
  },
  {
    q: "How much can I earn?",
    a: "Earnings depend on your subscription package. Beginners earn around $8/day while Elite members can earn up to $200/day. Packages range from $240 to $6,000 per month in earnings.",
  },
  {
    q: "How do I get paid?",
    a: "We support M-PESA and bank transfers. You can request withdrawals once your balance reaches the minimum threshold. Payments are processed within 24-72 hours.",
  },
  {
    q: "What is the $10 welcome bonus?",
    a: "Every new worker who passes the assessment receives a $10 welcome bonus credited directly to their account. This is our way of welcoming you to the Remotask community.",
  },
  {
    q: "Is there a contract or commitment?",
    a: "No long-term commitments. Your subscription is month-to-month, and you can cancel anytime. We believe in flexibility and giving you full control of your work.",
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <Box bg="bg" minH="100vh" color="fg">
      {/* Navbar */}
      <Box
        position="sticky"
        top="0"
        zIndex="100"
        bg="bg.panel/90"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Container maxW="6xl">
          <Flex align="center" justify="space-between" py="4">
            <HStack gap="2" cursor="pointer" onClick={() => navigate("/")}>
              <Box bg="green.500" borderRadius="lg" p="1.5" color="white">
                <LuZap size={18} />
              </Box>
              <Text fontWeight="bold" fontSize="xl" color="fg">
                Remotask
              </Text>
            </HStack>
            <HStack gap="3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                colorPalette="green"
                size="sm"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        py={{ base: "16", md: "24" }}
        background="radial-gradient(ellipse at top, rgba(34,197,94,0.15) 0%, transparent 70%)"
      >
        <Container maxW="4xl" textAlign="center">
          <Badge
            colorPalette="green"
            variant="subtle"
            px="4"
            py="1.5"
            borderRadius="full"
            mb="6"
            fontSize="sm"
          >
            <LuZap size={12} />
            Now Hiring Remote AI Trainers
          </Badge>
          <Heading
            size={{ base: "3xl", md: "5xl" }}
            fontWeight="extrabold"
            lineHeight="tight"
            mb="6"
            color="fg"
          >
            Earn Money Training
            <Box as="span" color="green.400"> AI from Home</Box>
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="fg.muted"
            mb="10"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            Join thousands of remote workers helping train the world's most advanced AI models.
            No experience required. Start earning today with flexible hours and instant payouts.
          </Text>
          <HStack justify="center" gap="4" mb="10" wrap="wrap">
            <Button
              size="lg"
              colorPalette="green"
              px="8"
              onClick={() => navigate("/signup")}
            >
              Get Started Free
              <LuArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              px="8"
              borderColor="border"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Learn More
            </Button>
          </HStack>
          <HStack justify="center" gap="4" wrap="wrap">
            <HStack
              bg="green.500/10"
              border="1px solid"
              borderColor="green.500/30"
              borderRadius="full"
              px="4"
              py="2"
              gap="2"
            >
              <LuZap size={14} color="var(--chakra-colors-green-400)" />
              <Text fontSize="sm" color="green.400" fontWeight="semibold">$10 Welcome Bonus</Text>
            </HStack>
            <HStack
              bg="bg.subtle"
              border="1px solid"
              borderColor="border"
              borderRadius="full"
              px="4"
              py="2"
              gap="2"
            >
              <LuUsers size={14} />
              <Text fontSize="sm" color="fg.muted" fontWeight="medium">1000+ Active Workers</Text>
            </HStack>
            <HStack
              bg="bg.subtle"
              border="1px solid"
              borderColor="border"
              borderRadius="full"
              px="4"
              py="2"
              gap="2"
            >
              <LuBanknote size={14} />
              <Text fontSize="sm" color="fg.muted" fontWeight="medium">Instant Payouts</Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* How It Works */}
      <Box id="how-it-works" py={{ base: "16", md: "20" }} bg="bg.subtle">
        <Container maxW="6xl">
          <VStack gap="4" mb="12" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              How It Works
            </Badge>
            <Heading size="2xl" fontWeight="bold" color="fg">
              Start Earning in 5 Simple Steps
            </Heading>
            <Text color="fg.muted" fontSize="lg" maxW="xl">
              Our streamlined process gets you earning money quickly without any complicated setup.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap="6">
            {STEPS.map((step, i) => (
              <VStack key={i} gap="4" textAlign="center" position="relative">
                <Box
                  w="14"
                  h="14"
                  borderRadius="full"
                  bg="green.500/15"
                  border="2px solid"
                  borderColor="green.500/40"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="green.400" fontWeight="bold" fontSize="lg">
                    {step.number}
                  </Text>
                </Box>
                <VStack gap="1">
                  <Text fontWeight="bold" color="fg" fontSize="md">
                    {step.title}
                  </Text>
                  <Text color="fg.muted" fontSize="sm" lineHeight="relaxed">
                    {step.description}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Packages Preview */}
      <Box py={{ base: "16", md: "20" }}>
        <Container maxW="6xl">
          <VStack gap="4" mb="12" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              Pricing Plans
            </Badge>
            <Heading size="2xl" fontWeight="bold" color="fg">
              Choose Your Earnings Package
            </Heading>
            <Text color="fg.muted" fontSize="lg" maxW="xl">
              Select a plan that matches your skill level and earning goals.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
            {PACKAGES.map((pkg, i) => (
              <Box
                key={i}
                bg="bg.panel"
                borderRadius="2xl"
                border="1px solid"
                borderColor={pkg.popular ? "green.500/50" : "border"}
                p="6"
                position="relative"
                overflow="hidden"
                _hover={{ borderColor: "green.500/50", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                {pkg.popular && (
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
                    MOST POPULAR
                  </Box>
                )}
                <VStack align="start" gap="4">
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color="fg" mb="1">
                      {pkg.name}
                    </Text>
                    <HStack align="baseline" gap="1">
                      <Text fontSize="2xl" fontWeight="extrabold" color="green.400">
                        {pkg.price}
                      </Text>
                      <Text color="fg.muted" fontSize="sm">{pkg.period}</Text>
                    </HStack>
                  </Box>
                  <Box
                    bg="green.500/10"
                    borderRadius="lg"
                    px="3"
                    py="2"
                    w="full"
                  >
                    <Text color="green.400" fontWeight="bold" fontSize="sm">
                      Daily: {pkg.daily}/day
                    </Text>
                    <Text color="fg.muted" fontSize="xs">{pkg.tasks} • {pkg.perTask}/task</Text>
                  </Box>
                  <VStack align="start" gap="2" w="full">
                    {pkg.features.map((f, j) => (
                      <HStack key={j} gap="2">
                        <Box color="green.400" flexShrink={0}>
                          <LuCircleCheck size={14} />
                        </Box>
                        <Text fontSize="sm" color="fg.muted">{f}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Button
                    w="full"
                    colorPalette="green"
                    variant={pkg.popular ? "solid" : "outline"}
                    size="sm"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Benefits */}
      <Box py={{ base: "16", md: "20" }} bg="bg.subtle">
        <Container maxW="6xl">
          <VStack gap="4" mb="12" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              Why Remotask
            </Badge>
            <Heading size="2xl" fontWeight="bold" color="fg">
              Built for Remote Workers
            </Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6">
            {BENEFITS.map((b, i) => (
              <Box
                key={i}
                bg="bg.panel"
                borderRadius="2xl"
                border="1px solid"
                borderColor="border"
                p="6"
                _hover={{ borderColor: "green.500/30" }}
                transition="border-color 0.2s"
              >
                <Box
                  w="12"
                  h="12"
                  borderRadius="xl"
                  bg="green.500/15"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb="4"
                  color="green.400"
                >
                  <b.icon size={22} />
                </Box>
                <Text fontWeight="bold" color="fg" mb="2">{b.title}</Text>
                <Text color="fg.muted" fontSize="sm" lineHeight="relaxed">{b.description}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Banner */}
      <Box py="12" bg="green.500/10" borderY="1px solid" borderColor="green.500/20">
        <Container maxW="4xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="8" textAlign="center">
            {[
              { value: "1,000+", label: "Active Workers" },
              { value: "$50K+", label: "Paid Out Monthly" },
              { value: "10K+", label: "Tasks Completed" },
              { value: "24hrs", label: "Avg Payout Time" },
            ].map((stat, i) => (
              <VStack key={i} gap="1">
                <Text fontSize="2xl" fontWeight="extrabold" color="green.400">{stat.value}</Text>
                <Text color="fg.muted" fontSize="sm">{stat.label}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box py={{ base: "16", md: "20" }}>
        <Container maxW="3xl">
          <VStack gap="4" mb="12" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              FAQ
            </Badge>
            <Heading size="2xl" fontWeight="bold" color="fg">
              Frequently Asked Questions
            </Heading>
          </VStack>
          <AccordionRoot multiple bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" overflow="hidden">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                borderBottom={i < FAQS.length - 1 ? "1px solid" : "none"}
                borderColor="border"
              >
                <AccordionItemTrigger px="6" py="4" _hover={{ bg: "bg.subtle" }}>
                  <Text fontWeight="semibold" color="fg" textAlign="left">{faq.q}</Text>
                </AccordionItemTrigger>
                <AccordionItemContent px="6" pb="4">
                  <Text color="fg.muted" lineHeight="relaxed">{faq.a}</Text>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Container>
      </Box>

      {/* CTA */}
      <Box py={{ base: "16", md: "20" }} bg="bg.subtle">
        <Container maxW="2xl" textAlign="center">
          <Heading size="2xl" fontWeight="bold" mb="4" color="fg">
            Ready to Start Earning?
          </Heading>
          <Text color="fg.muted" fontSize="lg" mb="8">
            Join over 1,000 workers already earning from home. Sign up today and get your $10 welcome bonus.
          </Text>
          <Button
            size="xl"
            colorPalette="green"
            px="10"
            py="6"
            fontSize="lg"
            onClick={() => navigate("/signup")}
          >
            Get Started Free — Claim $10 Bonus
            <LuArrowRight />
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box py="8" borderTop="1px solid" borderColor="border" bg="bg.panel">
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap="4"
          >
            <HStack gap="2">
              <Box bg="green.500" borderRadius="md" p="1" color="white">
                <LuZap size={14} />
              </Box>
              <Text fontWeight="bold" color="fg">Remotask</Text>
            </HStack>
            <Text color="fg.muted" fontSize="sm">
              © {new Date().getFullYear()} Remotask. All rights reserved.
            </Text>
            <HStack gap="4">
              <Text color="fg.muted" fontSize="sm" cursor="pointer" _hover={{ color: "fg" }}>Privacy</Text>
              <Text color="fg.muted" fontSize="sm" cursor="pointer" _hover={{ color: "fg" }}>Terms</Text>
              <Text color="fg.muted" fontSize="sm" cursor="pointer" _hover={{ color: "fg" }}>Contact</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
