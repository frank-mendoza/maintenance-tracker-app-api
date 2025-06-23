"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "../ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { ColorModeProvider } from "../ui/color-mode";

export function MainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useGlobalStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (user || localUser) {
      router.push("/overview");
    }
  }, [user]);

  if (loading) return <></>;
  return (
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
