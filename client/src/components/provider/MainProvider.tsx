"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { ColorModeProvider } from "../ui/color-mode";
import { Loading } from "../Loading";
import { ROLES_TYPES } from "@/lib/constants/constants";
import { fetchUser } from "@/lib/api/user";

export function MainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearUser } = useGlobalStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      const localUser = localStorage.getItem("user");
      const isPublicRoute =
        pathname?.startsWith("/login") || pathname?.startsWith("/register");

      let currentUser = user;

      // Fetch user if not already set
      if (!user && !localUser) {
        const fetched = await fetchUser();

        if (fetched.error) {
          clearUser();
          router.push("/login");
          setLoading(false);
          return;
        }

        currentUser = fetched.user;
        setUser(fetched.user);
      }

      // Redirect if already authenticated and on public route
      if (currentUser && isPublicRoute) {
        if (
          currentUser.role === ROLES_TYPES.TENANT ||
          currentUser.role === ROLES_TYPES.TECH
        ) {
          router.push("/maintenance-logs");
        } else {
          router.push("/overview");
        }
      }

      setLoading(false);
    };

    initializeUser();
  }, [clearUser, pathname, router, setUser, user]);

  if (loading) return <Loading />;

  return (
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
