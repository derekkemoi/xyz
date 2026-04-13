import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
//   Separator,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import {
  LuLogOut,
  LuRefreshCw,
  LuCircleCheck,
//   LuClock,
  LuShield,
  LuCalendar,
  LuListTodo,
  LuWallet,
  LuPackage,
} from "react-icons/lu"
import AppShell from "@/components/layout/AppShell"
import { Avatar } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth-store"
import { useWalletStore } from "@/store/wallet-store"
import { useSubscriptionStore } from "@/store/subscription-store"
import { useTaskStore } from "@/store/task-store"
import { formatDate, formatCurrency } from "@/lib/formatters"
import { STORAGE_KEYS } from "@/lib/constants"
import { toaster } from "@/components/ui/toaster"
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { balance, earnings, welcomeBonusAwarded } = useWalletStore()
  const { activePackage } = useSubscriptionStore()
  const { completedTasks } = useTaskStore()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const assessmentRaw = localStorage.getItem(STORAGE_KEYS.ASSESSMENT)
  let assessmentPassed = false
  let assessmentScore = 0
  if (assessmentRaw) {
    try {
      const parsed = JSON.parse(assessmentRaw)
      assessmentPassed = parsed.passed === true
      assessmentScore = parsed.score || 0
    } catch {
      // Ignore parsing errors
    }
  }

  const totalEarned = earnings.reduce((sum, e) => sum + e.amount, 0)

  const handleLogout = () => {
    logout()
    navigate("/")
    toaster.create({
      title: "Logged out",
      description: "You have been logged out successfully.",
      type: "info",
    })
  }

  const handleResetData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
    window.location.reload()
  }

  return (
    <AppShell>
      <VStack gap="6" align="stretch" maxW="640px" mx="auto">
        {/* Header */}
        <Heading size="xl" color="fg">Profile</Heading>

        {/* Profile Card */}
        <Box
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p="6"
        >
          <HStack gap="5" wrap="wrap">
            <Avatar
              size="2xl"
              name={user?.name || "User"}
              bg="green.500"
              color="white"
            />
            <VStack align="start" gap="2">
              <VStack align="start" gap="0">
                <Heading size="lg" color="fg">{user?.name}</Heading>
                <Text color="fg.muted" fontSize="sm">{user?.email}</Text>
              </VStack>
              <HStack gap="2" wrap="wrap">
                {assessmentPassed && (
                  <Badge colorPalette="green" variant="subtle" size="sm">
                    <LuCircleCheck size={10} />
                    Qualified Worker
                  </Badge>
                )}
                {welcomeBonusAwarded && (
                  <Badge colorPalette="yellow" variant="subtle" size="sm">
                    Welcome Bonus Claimed
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={3} gap="4">
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4" textAlign="center">
            <VStack gap="1">
              <Box color="fg.muted" display="flex" justifyContent="center">
                <LuWallet size={16} />
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="green.400">{formatCurrency(balance)}</Text>
              <Text fontSize="xs" color="fg.muted">Balance</Text>
            </VStack>
          </Box>
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4" textAlign="center">
            <VStack gap="1">
              <Box color="fg.muted" display="flex" justifyContent="center">
                <LuListTodo size={16} />
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="fg">{completedTasks.length}</Text>
              <Text fontSize="xs" color="fg.muted">Tasks Done</Text>
            </VStack>
          </Box>
          <Box bg="bg.panel" borderRadius="xl" border="1px solid" borderColor="border" p="4" textAlign="center">
            <VStack gap="1">
              <Box color="fg.muted" display="flex" justifyContent="center">
                <LuWallet size={16} />
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="fg">{formatCurrency(totalEarned)}</Text>
              <Text fontSize="xs" color="fg.muted">Total Earned</Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Account Info */}
        <Box bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" overflow="hidden">
          <Box px="5" py="4" borderBottom="1px solid" borderColor="border">
            <Text fontWeight="bold" color="fg">Account Information</Text>
          </Box>
          <VStack gap="0" align="stretch">
            <HStack px="5" py="4" justify="space-between" borderBottom="1px solid" borderColor="border">
              <HStack gap="3">
                <Box color="fg.muted"><LuCalendar size={15} /></Box>
                <Text fontSize="sm" color="fg.muted">Member Since</Text>
              </HStack>
              <Text fontSize="sm" color="fg" fontWeight="medium">
                {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </Text>
            </HStack>

            <HStack px="5" py="4" justify="space-between" borderBottom="1px solid" borderColor="border">
              <HStack gap="3">
                <Box color="fg.muted"><LuShield size={15} /></Box>
                <Text fontSize="sm" color="fg.muted">Assessment Status</Text>
              </HStack>
              <Badge
                colorPalette={assessmentPassed ? "green" : "gray"}
                variant="subtle"
                size="sm"
              >
                {assessmentPassed ? (
                  <HStack gap="1">
                    <LuCircleCheck size={10} />
                    <Text>Passed ({assessmentScore}/{5})</Text>
                  </HStack>
                ) : "Not Attempted"}
              </Badge>
            </HStack>

            <HStack px="5" py="4" justify="space-between">
              <HStack gap="3">
                <Box color="fg.muted"><LuPackage size={15} /></Box>
                <Text fontSize="sm" color="fg.muted">Active Package</Text>
              </HStack>
              {activePackage ? (
                <Badge colorPalette="green" variant="subtle" size="sm">
                  {activePackage.name}
                </Badge>
              ) : (
                <HStack gap="2">
                  <Text fontSize="sm" color="fg.muted">None</Text>
                  <Button
                    size="xs"
                    colorPalette="green"
                    variant="ghost"
                    onClick={() => navigate("/packages")}
                  >
                    Upgrade
                  </Button>
                </HStack>
              )}
            </HStack>
          </VStack>
        </Box>

        {/* Actions */}
        <Box bg="bg.panel" borderRadius="2xl" border="1px solid" borderColor="border" overflow="hidden">
          <Box px="5" py="4" borderBottom="1px solid" borderColor="border">
            <Text fontWeight="bold" color="fg">Account Actions</Text>
          </Box>
          <VStack gap="0" align="stretch" p="4">
            <Button
              variant="ghost"
              colorPalette="red"
              justifyContent="start"
              size="lg"
              px="3"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LuLogOut />
              Sign Out
            </Button>
            {/* <Button
              variant="ghost"
              justifyContent="start"
              size="lg"
              px="3"
              color="fg.muted"
              _hover={{ color: "fg", bg: "bg.subtle" }}
              onClick={() => setShowResetDialog(true)}
            >
              <LuRefreshCw />
              Reset Demo Data
            </Button> */}
          </VStack>
        </Box>

        {/* Logout Confirmation Dialog */}
        <DialogRoot open={showLogoutDialog} onOpenChange={(e) => setShowLogoutDialog(e.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Out</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text color="fg.muted">Are you sure you want to sign out of your account?</Text>
            </DialogBody>
            <DialogFooter>
              <HStack gap="3" justify="end" w="full">
                <Button variant="ghost" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
                <Button colorPalette="red" onClick={handleLogout}>
                  <LuLogOut />
                  Sign Out
                </Button>
              </HStack>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        {/* Reset Data Confirmation Dialog */}
        <DialogRoot open={showResetDialog} onOpenChange={(e) => setShowResetDialog(e.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Demo Data</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <VStack gap="3" align="start">
                <Text color="fg.muted">
                  This will clear ALL your data including your account, earnings, tasks, and package. This action cannot be undone.
                </Text>
                <Text color="red.400" fontSize="sm" fontWeight="semibold">
                  You will be logged out and all data will be permanently deleted.
                </Text>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <HStack gap="3" justify="end" w="full">
                <Button variant="ghost" onClick={() => setShowResetDialog(false)}>Cancel</Button>
                <Button colorPalette="red" onClick={handleResetData}>
                  <LuRefreshCw />
                  Reset Everything
                </Button>
              </HStack>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </VStack>
    </AppShell>
  )
}
