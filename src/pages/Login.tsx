import { useEffect } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  Flex,
} from "@chakra-ui/react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LuZap, LuMail, LuLock } from "react-icons/lu"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/auth-store"
import { STORAGE_KEYS } from "@/lib/constants"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      const assessmentRaw = localStorage.getItem(STORAGE_KEYS.ASSESSMENT)
      let passed = false
      if (assessmentRaw) {
        try {
          passed = JSON.parse(assessmentRaw).passed === true
        } catch {
          passed = false
        }
      }
      if (passed) {
        navigate("/dashboard")
      } else {
        navigate("/assessment")
      }
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Login Failed",
        description: error,
        type: "error",
      })
      clearError()
    }
  }, [error, clearError])

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password)
  }

  return (
    <Box bg="bg" minH="100vh" display="flex" alignItems="center" justifyContent="center" p="4">
      <Box w="full" maxW="400px">
        {/* Logo */}
        <VStack gap="2" mb="8" textAlign="center">
          <HStack
            gap="2"
            cursor="pointer"
            justify="center"
            onClick={() => navigate("/")}
          >
            <Box bg="green.500" borderRadius="lg" p="2" color="white">
              <LuZap size={20} />
            </Box>
            <Text fontWeight="bold" fontSize="2xl" color="fg">Remotask</Text>
          </HStack>
          <Heading size="xl" color="fg" fontWeight="bold">Welcome back</Heading>
          <Text color="fg.muted" fontSize="sm">Sign in to your account to continue</Text>
        </VStack>

        {/* Form Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="8"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap="5">
              <Field
                label="Email Address"
                invalid={!!errors.email}
                errorText={errors.email?.message}
                w="full"
              >
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  size="lg"
                  bg="bg.subtle"
                  borderColor="border"
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                />
              </Field>

              <Field
                label="Password"
                invalid={!!errors.password}
                errorText={errors.password?.message}
                w="full"
              >
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  size="lg"
                  bg="bg.subtle"
                  borderColor="border"
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                />
              </Field>

              <Button
                type="submit"
                colorPalette="green"
                size="lg"
                w="full"
                loading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center" mt="6" color="fg.muted" fontSize="sm">
          Don't have an account?{" "}
          <Box
            as={Link}
            to="/signup"
            color="green.400"
            fontWeight="semibold"
            _hover={{ color: "green.300" }}
          >
            Sign up for free
          </Box>
        </Text>
      </Box>
    </Box>
  )
}
