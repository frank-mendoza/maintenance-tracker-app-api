"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { ColorModeProvider } from "../ui/color-mode";
import { fetchUser } from "@/lib/api/user";
import { Loading } from "../Loading";

export function MainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearUser } = useGlobalStore();
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

  useEffect(() => {
    (async () => {
      const user: any = await fetchUser();

      if (user.error) {
        router.push("/login");
        clearUser();
      } else {
        setUser(user.user);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
