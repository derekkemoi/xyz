import { ReactNode, useState } from "react"
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  IconButton,
} from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LuLayoutDashboard,
  LuListTodo,
  LuPackage,
  LuWallet,
  LuArrowDownToLine,
  LuUser,
  LuZap,
  LuMenu,
} from "react-icons/lu"
import { Avatar } from "@/components/ui/avatar"
import {
  DrawerRoot,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useAuthStore } from "@/store/auth-store"

interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LuLayoutDashboard /> },
  { label: "Tasks", path: "/tasks", icon: <LuListTodo /> },
  { label: "Packages", path: "/packages", icon: <LuPackage /> },
  { label: "Earnings", path: "/earnings", icon: <LuWallet /> },
  { label: "Withdraw", path: "/withdraw", icon: <LuArrowDownToLine /> },
  { label: "Profile", path: "/profile", icon: <LuUser /> },
]

interface SidebarContentProps {
  onClose?: () => void
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  const handleNav = (path: string) => {
    navigate(path)
    onClose?.()
  }

  return (
    <Flex direction="column" h="full" py="4">
      <HStack px="4" pb="6" gap="2">
        <Box
          bg="green.500"
          borderRadius="lg"
          p="1.5"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <LuZap size={18} />
        </Box>
        <Text fontWeight="bold" fontSize="xl" color="fg" letterSpacing="tight">
          Remotask
        </Text>
      </HStack>

      <VStack gap="1" flex="1" align="stretch" px="3">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <HStack
              key={item.path}
              gap="3"
              px="3"
              py="2.5"
              borderRadius="lg"
              cursor="pointer"
              bg={isActive ? "green.500/20" : "transparent"}
              color={isActive ? "green.400" : "fg.muted"}
              _hover={{
                bg: isActive ? "green.500/20" : "bg.subtle",
                color: isActive ? "green.400" : "fg",
              }}
              transition="all 0.15s"
              onClick={() => handleNav(item.path)}
            >
              <Box fontSize="lg" flexShrink={0}>
                {item.icon}
              </Box>
              <Text fontWeight={isActive ? "semibold" : "medium"} fontSize="sm">
                {item.label}
              </Text>
            </HStack>
          )
        })}
      </VStack>

      <Box px="3" pt="4" borderTop="1px solid" borderColor="border">
        <HStack gap="3" px="2" py="2">
          <Avatar
            size="sm"
            name={user?.name || "User"}
            bg="green.500"
            color="white"
          />
          <VStack gap="0" align="start" flex="1" overflow="hidden">
            <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
              {user?.name || "User"}
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {user?.email || ""}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Flex>
  )
}

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Flex minH="100dvh" bg="bg">
      {/* Desktop Sidebar */}
      <Box
        w="240px"
        flexShrink={0}
        bg="bg.panel"
        borderRight="1px solid"
        borderColor="border"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        zIndex="10"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <DrawerRoot
        open={drawerOpen}
        onOpenChange={(e) => setDrawerOpen(e.open)}
        placement="start"
      >
        <DrawerContent maxW="240px" bg="bg.panel">
          <DrawerHeader borderBottom="1px solid" borderColor="border" pb="0">
            <DrawerTitle srOnly>Navigation Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody p="0">
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>

      {/* Main Content */}
      <Box flex="1" ml={{ base: "0", md: "240px" }} minW="0">
        {/* Mobile Header */}
        <Box
          display={{ base: "flex", md: "none" }}
          alignItems="center"
          px="4"
          py="3"
          bg="bg.panel"
          borderBottom="1px solid"
          borderColor="border"
          position="sticky"
          top="0"
          zIndex="9"
        >
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
          >
            <LuMenu />
          </IconButton>
          <HStack gap="2" ml="3">
            <Box
              bg="green.500"
              borderRadius="md"
              p="1"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LuZap size={14} />
            </Box>
            <Text fontWeight="bold" fontSize="lg" color="fg">
              Remotask
            </Text>
          </HStack>
        </Box>

        {/* Page Content — extra bottom padding on mobile for bottom nav */}
        <Box
          p={{ base: "4", md: "6" }}
          pb={{ base: "24", md: "6" }}
          minH="calc(100vh - 60px)"
        >
          {children}
        </Box>
      </Box>

      {/* Mobile Bottom Navigation Bar */}
      <Box
        display={{ base: "flex", md: "none" }}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="sticky"
        bg="bg.panel"
        borderTop="1px solid"
        borderColor="border"
        px="2"
        py="2"
        safeAreaPaddingBottom="env(safe-area-inset-bottom)"
      >
        <HStack w="full" justify="space-around" gap="0">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Flex
                key={item.path}
                direction="column"
                align="center"
                gap="0.5"
                flex="1"
                py="1"
                px="1"
                cursor="pointer"
                borderRadius="xl"
                color={isActive ? "green.400" : "fg.subtle"}
                _hover={{ color: isActive ? "green.400" : "fg.muted" }}
                transition="all 0.15s"
                onClick={() => navigate(item.path)}
                position="relative"
              >
                {isActive && (
                  <Box
                    position="absolute"
                    top="-2px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="4"
                    h="0.5"
                    bg="green.400"
                    borderRadius="full"
                  />
                )}
                <Box
                  fontSize="xl"
                  bg={isActive ? "green.500/15" : "transparent"}
                  borderRadius="lg"
                  p="1.5"
                  transition="all 0.15s"
                >
                  {item.icon}
                </Box>
                <Text
                  fontSize="2xs"
                  fontWeight={isActive ? "semibold" : "medium"}
                  letterSpacing="tight"
                  lineHeight="1"
                >
                  {item.label}
                </Text>
              </Flex>
            )
          })}
        </HStack>
      </Box>
    </Flex>
  )
}
