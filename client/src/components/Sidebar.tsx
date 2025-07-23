// components/Sidebar.tsx
"use client";

import useGlobalStore from "@/lib/store/useGlobalStore";
import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  IconButton,
  useDisclosure,
  Drawer,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiGrid,
  FiUsers,
  FiTool,
  FiUser,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

export default function Sidebar() {
  const { user } = useGlobalStore();
  const pathname = usePathname();

  const { open, onOpen, onClose } = useDisclosure();

  const links = [
    {
      href: "/overview",
      label: "Overview",
      icon: <FiHome />,
      isAdmin: user?.role === "landlord",
    },
    {
      href: "/properties",
      label: "Properties",
      icon: <FiGrid />,
      isAdmin: user?.role === "landlord",
    },
    {
      href: "/tenants",
      label: "Tenants",
      icon: <FiUsers />,
      isAdmin: user?.role === "landlord",
    },
    { href: "/maintenance-logs", label: "Maintenance Logs", icon: <FiTool /> },
    { href: "/account", label: "Account", icon: <FiUser /> },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
    // { href: "/logout", label: "Logout", icon: <FiLogOut /> },
  ];

  const renderLinks = () => (
    <VStack align="start" gap={2}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        if (!link?.isAdmin && link.isAdmin !== undefined) return null;
        return (
          <Link
            key={link.href}
            as={NextLink}
            href={link.href}
            display="flex"
            alignItems="center"
            textDecoration={"none"}
            transition={"ease-in-out 0.2s"}
            w="100%"
            p={2}
            borderRadius="md"
            color={isActive ? "white" : "gray.700"}
            bg={isActive ? "gray.700" : "transparent"}
            _hover={{ bg: "gray.700", color: "white" }}
            _active={{ bg: "gray.700", color: "white" }}
            _focus={{ boxShadow: "outline" }}
          >
            <Icon mr={2}>{link.icon}</Icon>
            {link.label}
          </Link>
        );
      })}
    </VStack>
  );
  return (
    <>
      {/* Mobile Top Nav with Menu Button */}
      <Box
        display={{ base: "block", sm: "none" }}
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        top={8}
        left={5}
        zIndex={10}
      >
        <IconButton variant="ghost" aria-label="Open Menu" onClick={onOpen}>
          <FiMenu />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root open={open} onOpenChange={onOpen}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content p={4}>
              <Drawer.Header>
                <Drawer.Title>PM Tracker</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>{renderLinks()}</Drawer.Body>

              <Drawer.CloseTrigger asChild onClick={onClose}>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Box
        display={{ base: "none", sm: "block" }}
        w="240px"
        minH="100vh"
        p={6}
        position="sticky"
        top={0}
      >
        <Text fontSize="1xl" fontWeight="bold" mb={8}>
          Property Maintenance Tracker
        </Text>
        <VStack align="start">{renderLinks()}</VStack>
      </Box>
    </>
  );
}
