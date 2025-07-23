"use client";

import useGlobalStore from "@/lib/store/useGlobalStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useGlobalStore();
  const router = useRouter();
  useEffect(() => {
    if (user && user.role === "landlord") {
      router.push("/overview");
    } else router.push("/maintenance-logs");
  }, [router, user]);

  return <>Main</>;
}
