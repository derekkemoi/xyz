import { useEffect, useState } from "react"
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
  Badge,
  Separator,
  Spinner,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
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
  LuGift,
  LuBrainCircuit,
  LuSmartphone,
  LuBadgeCheck,
  LuChartBar,
  LuLock,
} from "react-icons/lu"
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@/components/ui/accordion"
import { fetchPackages } from "@/lib/api"
import type { Package } from "@/types/package"

const TIER_COLORS: Record<string, { accent: string; border: string; bg: string }> = {
  beginner: { accent: "blue.400", border: "blue.500/30", bg: "blue.500/8" },
  average_skilled: { accent: "teal.400", border: "teal.500/30", bg: "teal.500/8" },
  expert: { accent: "green.400", border: "green.500/50", bg: "green.500/10" },
  elite: { accent: "orange.400", border: "orange.500/40", bg: "orange.500/8" },
}

const TIER_POPULAR: Record<string, boolean> = { expert: true }

const STEPS = [
  { icon: LuUsers, number: "01", title: "Sign Up Free", description: "Create your account in under 2 minutes. No credit card needed to get started." },
  { icon: LuBrainCircuit, number: "02", title: "Pass Assessment", description: "Complete a 5-question skills test. Most workers pass on the first try." },
  { icon: LuZap, number: "03", title: "Choose Package", description: "Pick a subscription plan that fits your earning goals and activate instantly." },
  { icon: LuSmartphone, number: "04", title: "Work from Phone", description: "Complete simple AI training tasks from your smartphone, anywhere, anytime." },
  { icon: LuBanknote, number: "05", title: "Get Paid", description: "Withdraw earnings via M-PESA or bank transfer. Payouts in 24–72 hours." },
]

const BENEFITS = [
  {
    icon: LuGlobe,
    title: "100% Remote",
    description: "Work from anywhere in Kenya — Nairobi, Mombasa, Kisumu, or rural areas. All you need is internet.",
  },
  {
    icon: LuClock,
    title: "Flexible Hours",
    description: "Morning, afternoon, or night — work whenever suits your lifestyle. No fixed shifts, ever.",
  },
  {
    icon: LuBanknote,
    title: "Instant Payouts",
    description: "Withdraw directly to your M-PESA or bank. No delays, no complicated forms.",
  },
  {
    icon: LuShield,
    title: "Safe & Legitimate",
    description: "Trusted by 2,847+ workers. Transparent earnings, real payouts, no hidden fees.",
  },
]

const TESTIMONIALS = [
  {
    name: "Grace Wanjiku",
    location: "Nairobi",
    earning: "KES 38,000/mo",
    text: "I started with the Beginner package and upgraded after my first month. Now I earn more than my previous office job — from home!",
    tier: "Expert",
  },
  {
    name: "James Kamau",
    location: "Kisumu",
    earning: "KES 18,500/mo",
    text: "The tasks are simple and straightforward. I do them on my phone during lunch and evenings. Best side income I've found.",
    tier: "Average Skilled",
  },
  {
    name: "Sophia Njeri",
    location: "Mombasa",
    earning: "KES 62,000/mo",
    text: "I was skeptical at first but after seeing the M-PESA payments hit my account, I upgraded to Elite. It changed my life.",
    tier: "Elite",
  },
]

const FAQS = [
  {
    q: "What is Remotask?",
    a: "Remotask is a platform that connects remote workers with AI companies that need help training their artificial intelligence models. You complete simple tasks like labeling data, arranging sentences, and classifying content — no technical skills required.",
  },
  {
    q: "Do I need any experience?",
    a: "No experience needed. Our tasks are designed for everyone. You only need to pass a short 5-question assessment and have a reliable internet connection. Most people pass on their first attempt.",
  },
  {
    q: "How much can I really earn?",
    a: "Earnings depend on your package. Beginners earn around $8/day, while Elite members earn up to $200/day. Workers on the Expert plan typically earn KES 25,000–40,000 per month.",
  },
  {
    q: "How do I receive my money?",
    a: "We support M-PESA and bank transfers. Request a withdrawal once your balance meets the minimum threshold. Payments are processed within 24–72 hours.",
  },
  {
    q: "What is the $10 welcome bonus?",
    a: "Every new worker who passes the assessment receives a $10 welcome bonus credited instantly to their wallet. This is our way of welcoming you to the community.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term commitments. Subscriptions are month-to-month and you can cancel at any time. We believe in giving you full control.",
  },
  {
    q: "Why do I need to pay for a package?",
    a: "Packages give you access to a daily batch of paid AI tasks. Think of it as an investment — the package unlocks your earning potential. The earnings from just a few days of tasks cover the subscription cost.",
  },
]

const LIVE_WITHDRAWALS = [
  { name: "Peter O.", location: "Nairobi", amount: "KES 12,000" },
  { name: "Mary A.", location: "Kisumu", amount: "KES 4,500" },
  { name: "Brian K.", location: "Eldoret", amount: "KES 8,200" },
]

function PackageCard({ pkg, onSelect }: { pkg: Package; onSelect: () => void }) {
  const isPopular = TIER_POPULAR[pkg.tier]
  const colors = TIER_COLORS[pkg.tier] ?? TIER_COLORS.beginner

  return (
    <Box
      bg="bg.panel"
      borderRadius="2xl"
      border="2px solid"
      borderColor={isPopular ? "green.500/60" : colors.border}
      p="6"
      position="relative"
      overflow="hidden"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
      transition="all 0.25s"
      boxShadow={isPopular ? "0 0 0 1px var(--chakra-colors-green-500)" : undefined}
    >
      {isPopular && (
        <>
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="3px"
            bg="linear-gradient(90deg, #22c55e, #16a34a)"
          />
          <Box
            position="absolute"
            top="4"
            right="-8"
            bg="green.500"
            color="white"
            fontSize="2xs"
            fontWeight="bold"
            px="10"
            py="1"
            transform="rotate(45deg)"
            letterSpacing="wide"
          >
            POPULAR
          </Box>
        </>
      )}

      <Box
        position="absolute"
        bottom="-20"
        right="-20"
        w="120px"
        h="120px"
        borderRadius="full"
        bg={colors.bg}
        pointerEvents="none"
      />

      <VStack align="start" gap="5" position="relative">
        <Box>
          <Badge
            colorPalette={pkg.tier === "expert" ? "green" : pkg.tier === "elite" ? "orange" : pkg.tier === "average_skilled" ? "teal" : "blue"}
            variant="subtle"
            mb="2"
            fontSize="xs"
            textTransform="capitalize"
          >
            {pkg.name}
          </Badge>
          <HStack align="baseline" gap="1">
            <Text fontSize="3xl" fontWeight="extrabold" color={colors.accent} lineHeight="1">
              ${pkg.monthlyEarnings.toLocaleString()}
            </Text>
            <Text color="fg.muted" fontSize="sm">/month</Text>
          </HStack>
          <Text fontSize="xs" color="fg.subtle" mt="0.5">
            You invest ${pkg.amount.toLocaleString()} to earn this
          </Text>
        </Box>

        <Box
          bg={colors.bg}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="xl"
          px="4"
          py="3"
          w="full"
        >
          <HStack justify="space-between">
            <VStack align="start" gap="0">
              <Text fontSize="xs" color="fg.muted">Daily earnings</Text>
              <Text fontWeight="extrabold" color={colors.accent} fontSize="lg">
                ${pkg.dailyEarnings}/day
              </Text>
            </VStack>
            <Separator orientation="vertical" h="8" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" color="fg.muted">Tasks/day</Text>
              <Text fontWeight="bold" color="fg" fontSize="lg">
                {pkg.tasksPerDay}
              </Text>
            </VStack>
            <Separator orientation="vertical" h="8" />
            <VStack align="start" gap="0">
              <Text fontSize="xs" color="fg.muted">Per task</Text>
              <Text fontWeight="bold" color="fg" fontSize="xs">
                ${pkg.pricePerTask.min}–${pkg.pricePerTask.max}
              </Text>
            </VStack>
          </HStack>
        </Box>

        <VStack align="start" gap="2" w="full">
          {pkg.benefits.slice(0, 4).map((f) => (
            <HStack key={f} gap="2">
              <Box color="green.400" flexShrink={0}>
                <LuCircleCheck size={14} />
              </Box>
              <Text fontSize="sm" color="fg.muted">{f}</Text>
            </HStack>
          ))}
        </VStack>

        <Box
          bg="green.500/8"
          border="1px dashed"
          borderColor="green.500/30"
          borderRadius="lg"
          px="3"
          py="2"
          w="full"
        >
          <Text fontSize="xs" color="green.400" fontWeight="semibold" textAlign="center">
            ROI: Earn back ${pkg.monthlyEarnings - pkg.amount > 0 ? `$${(pkg.monthlyEarnings - pkg.amount).toLocaleString()} profit` : "full cost"} in month 1
          </Text>
        </Box>

        <Button
          w="full"
          colorPalette="green"
          variant={isPopular ? "solid" : "outline"}
          size="md"
          onClick={onSelect}
        >
          {isPopular ? "Get Started Now" : "Choose Plan"}
          <LuArrowRight />
        </Button>
      </VStack>
    </Box>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<Package[]>([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [liveIdx, setLiveIdx] = useState(0)

  useEffect(() => {
    fetchPackages().then((pkgs) => {
      setPackages(pkgs)
      setLoadingPackages(false)
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => setLiveIdx((i) => (i + 1) % LIVE_WITHDRAWALS.length), 3000)
    return () => clearInterval(id)
  }, [])

  const liveEntry = LIVE_WITHDRAWALS[liveIdx]

  return (
    <Box bg="bg" minH="100vh" color="fg">

      {/* Sticky Nav */}
      <Box
        position="sticky"
        top="0"
        zIndex="sticky"
        bg="bg.panel/90"
        backdropFilter="blur(16px)"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Container maxW="7xl">
          <Flex align="center" justify="space-between" py="4">
            <HStack gap="2" cursor="pointer" onClick={() => navigate("/")}>
              <Box bg="green.500" borderRadius="lg" p="1.5" color="white">
                <LuZap size={18} />
              </Box>
              <Text fontWeight="extrabold" fontSize="xl" color="fg">Remotask</Text>
            </HStack>
            <HStack gap="3" display={{ base: "none", md: "flex" }}>
              <Text
                fontSize="sm"
                color="fg.muted"
                cursor="pointer"
                _hover={{ color: "fg" }}
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                How it works
              </Text>
              <Text
                fontSize="sm"
                color="fg.muted"
                cursor="pointer"
                _hover={{ color: "fg" }}
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Pricing
              </Text>
              <Text
                fontSize="sm"
                color="fg.muted"
                cursor="pointer"
                _hover={{ color: "fg" }}
                onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
              >
                FAQ
              </Text>
            </HStack>
            <HStack gap="3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
              <Button colorPalette="green" size="sm" onClick={() => navigate("/signup")}>
                Get Started
                <LuArrowRight />
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Live withdrawal toast */}
      <Box
        position="fixed"
        bottom="6"
        left="6"
        zIndex="toast"
        maxW="300px"
        display={{ base: "none", md: "block" }}
      >
        <Box
          key={liveIdx}
          bg="bg.panel"
          border="1px solid"
          borderColor="green.500/30"
          borderRadius="xl"
          px="4"
          py="3"
          shadow="lg"
          style={{ animation: "slideUpFade 0.4s ease-out" }}
          css={{
            "@keyframes slideUpFade": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <HStack gap="3">
            <Box
              w="8" h="8" borderRadius="full"
              bg="green.500/15"
              display="flex" alignItems="center" justifyContent="center"
              color="green.400"
              flexShrink={0}
            >
              <LuBanknote size={14} />
            </Box>
            <VStack align="start" gap="0">
              <Text fontSize="xs" fontWeight="semibold" color="fg">
                {liveEntry.name} just withdrew
              </Text>
              <Text fontSize="xs" color="fg.muted">{liveEntry.location}</Text>
            </VStack>
            <Text fontSize="sm" fontWeight="extrabold" color="green.400" flexShrink={0}>
              {liveEntry.amount}
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* ─── HERO ─── */}
      <Box
        py={{ base: "20", md: "28" }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset="0"
          background="radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.18) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="20%"
          left="-10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="green.500/5"
          filter="blur(60px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="10%"
          right="-5%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="teal.500/5"
          filter="blur(40px)"
          pointerEvents="none"
        />

        <Container maxW="5xl" textAlign="center" position="relative">
          {/* Social proof pill */}
          <HStack justify="center" mb="6">
            <HStack
              bg="green.500/10"
              border="1px solid"
              borderColor="green.500/30"
              borderRadius="full"
              px="4"
              py="1.5"
              gap="2"
            >
              <Box
                w="1.5"
                h="1.5"
                borderRadius="full"
                bg="green.400"
                style={{ animation: "pulseGreen 1.5s ease-in-out infinite" }}
                css={{
                  "@keyframes pulseGreen": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.4 },
                  },
                }}
              />
              <Text fontSize="sm" color="green.400" fontWeight="semibold">
                2,847 workers earning right now
              </Text>
            </HStack>
          </HStack>

          <Heading
            size={{ base: "4xl", md: "6xl" }}
            fontWeight="extrabold"
            lineHeight="1.1"
            mb="6"
            color="fg"
          >
            Earn Real Money
            <Box as="span" display="block" color="green.400">
              Training AI from Home
            </Box>
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="fg.muted"
            mb="10"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            Join thousands completing simple AI tasks from their phones and earning
            steady income — no experience required, paid via M-PESA.
          </Text>

          <HStack justify="center" gap="4" mb="12" wrap="wrap">
            <Button
              size="xl"
              colorPalette="green"
              px="10"
              py="6"
              fontSize="lg"
              fontWeight="bold"
              onClick={() => navigate("/signup")}
              boxShadow="0 0 32px rgba(34,197,94,0.3)"
              _hover={{ boxShadow: "0 0 48px rgba(34,197,94,0.45)" }}
            >
              <LuGift />
              Start Free — Claim $10 Bonus
              <LuArrowRight />
            </Button>
            <Button
              size="xl"
              variant="outline"
              px="8"
              py="6"
              fontSize="md"
              borderColor="border"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              See How It Works
            </Button>
          </HStack>

          {/* Trust badges */}
          <Flex justify="center" gap="4" wrap="wrap">
            {[
              { icon: LuGift, text: "$10 Welcome Bonus" },
              { icon: LuBanknote, text: "Instant Payouts" },
              { icon: LuShield, text: "Secure & Trusted" },
              { icon: LuClock, text: "Work Anytime" },
            ].map(({ icon: Ic, text }) => (
              <HStack
                key={text}
                bg="bg.subtle"
                border="1px solid"
                borderColor="border"
                borderRadius="full"
                px="4"
                py="2"
                gap="2"
              >
                <Box color="green.400"><Ic size={13} /></Box>
                <Text fontSize="sm" color="fg.muted" fontWeight="medium">{text}</Text>
              </HStack>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* ─── STATS ─── */}
      <Box py="10" borderY="1px solid" borderColor="green.500/20" bg="green.500/5">
        <Container maxW="5xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="6" textAlign="center">
            {[
              { value: "2,847+", label: "Active Workers" },
              { value: "KES 8.4M+", label: "Paid Out Total" },
              { value: "98%", label: "On-Time Payments" },
              { value: "24hrs", label: "Avg Payout Time" },
            ].map((s) => (
              <VStack key={s.label} gap="1">
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" color="green.400">{s.value}</Text>
                <Text color="fg.muted" fontSize="sm">{s.label}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── HOW IT WORKS ─── */}
      <Box id="how-it-works" py={{ base: "16", md: "24" }}>
        <Container maxW="6xl">
          <VStack gap="4" mb="14" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              How It Works
            </Badge>
            <Heading size="3xl" fontWeight="extrabold" color="fg">
              Start Earning in 5 Simple Steps
            </Heading>
            <Text color="fg.muted" fontSize="lg" maxW="xl">
              No complicated setup. Most workers complete their first task within an hour of signing up.
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap="6">
            {STEPS.map((step, i) => (
              <VStack
                key={i}
                gap="4"
                textAlign="center"
                position="relative"
                p="5"
                bg="bg.panel"
                borderRadius="2xl"
                border="1px solid"
                borderColor="border"
                _hover={{ borderColor: "green.500/30", bg: "bg.subtle" }}
                transition="all 0.2s"
              >
                <Box
                  w="14" h="14" borderRadius="2xl"
                  bg="green.500/10"
                  border="1px solid"
                  borderColor="green.500/30"
                  display="flex" alignItems="center" justifyContent="center"
                  color="green.400"
                >
                  <step.icon size={24} />
                </Box>
                <Box
                  position="absolute"
                  top="3"
                  right="3"
                  bg="green.500/15"
                  borderRadius="full"
                  w="6" h="6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="2xs" fontWeight="bold" color="green.400">{step.number}</Text>
                </Box>
                <VStack gap="1">
                  <Text fontWeight="bold" color="fg" fontSize="md">{step.title}</Text>
                  <Text color="fg.muted" fontSize="sm" lineHeight="relaxed">{step.description}</Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── PRICING ─── */}
      <Box id="pricing" py={{ base: "16", md: "24" }} bg="bg.subtle">
        <Container maxW="7xl">
          <VStack gap="4" mb="14" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              Pricing Plans
            </Badge>
            <Heading size="3xl" fontWeight="extrabold" color="fg">
              Choose Your Earnings Package
            </Heading>
            <Text color="fg.muted" fontSize="lg" maxW="2xl">
              Every plan pays for itself quickly. Workers on the Expert plan earn back their subscription in under 2 weeks.
            </Text>
          </VStack>

          {loadingPackages ? (
            <Flex justify="center" py="16">
              <VStack gap="3">
                <Spinner size="lg" color="green.400" />
                <Text color="fg.muted" fontSize="sm">Loading latest pricing...</Text>
              </VStack>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={() => navigate("/signup")}
                />
              ))}
            </SimpleGrid>
          )}

          <Box
            mt="10"
            bg="bg.panel"
            border="1px solid"
            borderColor="green.500/25"
            borderRadius="2xl"
            p={{ base: "5", md: "6" }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap="4"
            >
              <HStack gap="3">
                <Box color="green.400"><LuBadgeCheck size={22} /></Box>
                <VStack align="start" gap="0">
                  <Text fontWeight="bold" color="fg" fontSize="sm">30-Day Earnings Guarantee</Text>
                  <Text fontSize="xs" color="fg.muted">
                    Complete your daily tasks and earn as advertised — or we'll work with you to make it right.
                  </Text>
                </VStack>
              </HStack>
              <HStack gap="3">
                <Box color="green.400"><LuLock size={22} /></Box>
                <VStack align="start" gap="0">
                  <Text fontWeight="bold" color="fg" fontSize="sm">Cancel Anytime</Text>
                  <Text fontSize="xs" color="fg.muted">Month-to-month. No contracts or hidden fees.</Text>
                </VStack>
              </HStack>
              <HStack gap="3">
                <Box color="green.400"><LuChartBar size={22} /></Box>
                <VStack align="start" gap="0">
                  <Text fontWeight="bold" color="fg" fontSize="sm">Track Every Shilling</Text>
                  <Text fontSize="xs" color="fg.muted">Full earnings dashboard with real-time balance updates.</Text>
                </VStack>
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>

      {/* ─── TESTIMONIALS ─── */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="5xl">
          <VStack gap="4" mb="14" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              Real Workers, Real Earnings
            </Badge>
            <Heading size="3xl" fontWeight="extrabold" color="fg">
              What Our Workers Say
            </Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
            {TESTIMONIALS.map((t) => (
              <Box
                key={t.name}
                bg="bg.panel"
                borderRadius="2xl"
                border="1px solid"
                borderColor="border"
                p="6"
                _hover={{ borderColor: "green.500/30" }}
                transition="border-color 0.2s"
              >
                <VStack align="start" gap="4">
                  <HStack gap="1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box key={i} color="yellow.400"><LuStar size={14} /></Box>
                    ))}
                  </HStack>
                  <Text color="fg.muted" fontSize="sm" lineHeight="relaxed" fontStyle="italic">
                    "{t.text}"
                  </Text>
                  <Separator />
                  <HStack justify="space-between" w="full">
                    <VStack align="start" gap="0">
                      <Text fontWeight="bold" color="fg" fontSize="sm">{t.name}</Text>
                      <Text fontSize="xs" color="fg.muted">{t.location}</Text>
                    </VStack>
                    <VStack align="end" gap="0">
                      <Text fontWeight="extrabold" color="green.400" fontSize="sm">{t.earning}</Text>
                      <Badge colorPalette="green" variant="subtle" size="sm">{t.tier}</Badge>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── BENEFITS ─── */}
      <Box py={{ base: "16", md: "24" }} bg="bg.subtle">
        <Container maxW="6xl">
          <VStack gap="4" mb="14" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              Why Remotask
            </Badge>
            <Heading size="3xl" fontWeight="extrabold" color="fg">
              Built for Remote Workers
            </Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6">
            {BENEFITS.map((b) => (
              <Box
                key={b.title}
                bg="bg.panel"
                borderRadius="2xl"
                border="1px solid"
                borderColor="border"
                p="6"
                _hover={{ borderColor: "green.500/30", bg: "bg.panel" }}
                transition="all 0.2s"
              >
                <Box
                  w="12" h="12" borderRadius="xl"
                  bg="green.500/12"
                  display="flex" alignItems="center" justifyContent="center"
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

      {/* ─── FAQ ─── */}
      <Box id="faq" py={{ base: "16", md: "24" }}>
        <Container maxW="3xl">
          <VStack gap="4" mb="12" textAlign="center">
            <Badge colorPalette="green" variant="subtle" px="3" py="1" borderRadius="full">
              FAQ
            </Badge>
            <Heading size="3xl" fontWeight="extrabold" color="fg">
              Frequently Asked Questions
            </Heading>
            <Text color="fg.muted">
              Still have questions? We've got answers.
            </Text>
          </VStack>
          <AccordionRoot
            multiple
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            overflow="hidden"
          >
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
                <AccordionItemContent px="6" pb="5">
                  <Text color="fg.muted" lineHeight="relaxed" fontSize="sm">{faq.a}</Text>
                </AccordionItemContent>
              </AccordionItem>
            ))}
          </AccordionRoot>
        </Container>
      </Box>

      {/* ─── FINAL CTA ─── */}
      <Box
        py={{ base: "20", md: "28" }}
        position="relative"
        overflow="hidden"
        bg="bg.subtle"
      >
        <Box
          position="absolute"
          inset="0"
          background="radial-gradient(ellipse 60% 80% at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Container maxW="2xl" textAlign="center" position="relative">
          <Box
            w="16" h="16" borderRadius="2xl"
            bg="green.500/15"
            border="1px solid"
            borderColor="green.500/30"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb="6"
            color="green.400"
          >
            <LuTrendingUp size={30} />
          </Box>
          <Heading size="3xl" fontWeight="extrabold" mb="4" color="fg">
            Ready to Start Earning?
          </Heading>
          <Text color="fg.muted" fontSize="lg" mb="8" lineHeight="relaxed">
            Join 2,847 workers already earning from home.
            Sign up today and receive your <Box as="span" color="green.400" fontWeight="bold">$10 welcome bonus</Box> instantly after the assessment.
          </Text>
          <VStack gap="4">
            <Button
              size="xl"
              colorPalette="green"
              px="12"
              py="7"
              fontSize="lg"
              fontWeight="bold"
              onClick={() => navigate("/signup")}
              boxShadow="0 0 40px rgba(34,197,94,0.35)"
              _hover={{ boxShadow: "0 0 60px rgba(34,197,94,0.5)" }}
            >
              <LuGift />
              Create Free Account — Get $10 Bonus
              <LuArrowRight />
            </Button>
            <Text fontSize="sm" color="fg.subtle">
              No credit card required to sign up. Assessment takes 2–3 minutes.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* ─── FOOTER ─── */}
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
