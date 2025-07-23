"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { ColorModeProvider } from "../ui/color-mode";

export function MainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useGlobalStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const isPublicRoute =
      pathname?.startsWith("/login") || pathname?.startsWith("/register");
    if ((user || localUser) && isPublicRoute) {
      if (user?.role === "tenant") router.push("/maintenance-logs");
      else router.push("/overview");
    }
    setLoading(false);
  }, [user, pathname, router]);

  if (loading) return <></>;
  return (
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
