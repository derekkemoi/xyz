import { useEffect } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
} from "@chakra-ui/react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LuZap } from "react-icons/lu"
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/store/auth-store"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, isAuthenticated, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/assessment")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Signup Failed",
        description: error,
        type: "error",
      })
      clearError()
    }
  }, [error, clearError])

  const onSubmit = (data: SignupFormData) => {
    signup(data.email, data.password, data.name)
  }

  return (
    <Box bg="bg" minH="100vh" display="flex" alignItems="center" justifyContent="center" p="4">
      <Box w="full" maxW="420px">
        <VStack gap="2" mb="8" textAlign="center">
          <HStack gap="2" cursor="pointer" justify="center" onClick={() => navigate("/")}>
            <Box bg="green.500" borderRadius="lg" p="2" color="white">
              <LuZap size={20} />
            </Box>
            <Text fontWeight="bold" fontSize="2xl" color="fg">Remotask</Text>
          </HStack>
          <Heading size="xl" color="fg" fontWeight="bold">Create your account</Heading>
          <Text color="fg.muted" fontSize="sm">
            Join thousands earning from home. Get $10 bonus on signup.
          </Text>
        </VStack>

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
                label="Full Name"
                invalid={!!errors.name}
                errorText={errors.name?.message}
                w="full"
              >
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="John Doe"
                  size="lg"
                  bg="bg.subtle"
                  borderColor="border"
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                />
              </Field>

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
                  placeholder="Minimum 6 characters"
                  size="lg"
                  bg="bg.subtle"
                  borderColor="border"
                  _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-green-500)" }}
                />
              </Field>

              <Field
                label="Confirm Password"
                invalid={!!errors.confirmPassword}
                errorText={errors.confirmPassword?.message}
                w="full"
              >
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Repeat your password"
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
                loadingText="Creating account..."
              >
                Create Account — Get $10 Bonus
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center" mt="6" color="fg.muted" fontSize="sm">
          Already have an account?{" "}
          <Box
            as={Link}
            to="/login"
            color="green.400"
            fontWeight="semibold"
            _hover={{ color: "green.300" }}
          >
            Sign in
          </Box>
        </Text>
      </Box>
    </Box>
  )
}
