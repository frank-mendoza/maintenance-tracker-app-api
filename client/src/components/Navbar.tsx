"use client";
// components/Navbar.tsx

import useGlobalStore from "@/lib/store/useGlobalStore";
import {
  Box,
  Flex,
  HStack,
  useDisclosure,
  Stack,
  Link,
  Text,
  Menu,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { toaster } from "./ui/toaster";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth";
import ProfileAvatar from "./ProfileAvatar";

const Links = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/dashboard/settings" },
];

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    as={NextLink}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      //   bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { user, clearUser } = useGlobalStore();
  const {
    open,
    //  onOpen, onClose
  } = useDisclosure();

  const router = useRouter();
  const handleSignOut = async () => {
    const logout: any = await logoutUser();
    if (logout?.success) {
      toaster.create({
        description: "Successfully logout!",
        type: "success",
      });

      router.push("/login");
      clearUser();
    } else {
      toaster.create({
        description: logout?.data?.msg || "Failed to logout. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Box px={4} shadow="none">
      <Flex h={16} alignItems={"center"} justifyContent={"end"}>
        <HStack gap="4">
          {/* <BiBell size={16} /> */}
          <Stack gap="0" textAlign={"right"}>
            <Text fontWeight="medium">
              {user?.name} {user?.lastName}
            </Text>
            <Text color="fg.muted" textStyle="sm">
              {user?.email}
            </Text>
          </Stack>

          <Menu.Root>
            <Menu.Trigger cursor={"pointer"}>
              <ProfileAvatar user={user} />
            </Menu.Trigger>
            <Menu.Positioner
            // mt={"16px"}
            // top={"2% !important"}
            // left={"auto !important"}
            // right={"84px"}
            >
              <Menu.Content>
                <Menu.Item
                  p={2}
                  value="new-txt"
                  onClick={() => router.push("/account")}
                >
                  Account
                </Menu.Item>
                <Menu.Item p={2} value="new-file" onClick={handleSignOut}>
                  Signout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </HStack>
      </Flex>

      {/* Mobile Menu */}
      {open ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"}>
            {Links.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
