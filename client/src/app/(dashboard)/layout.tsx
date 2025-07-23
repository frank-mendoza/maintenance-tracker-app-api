import { ReactNode } from "react";
import GlobalProvider from "@/components/provider/ChakraProvider";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <GlobalProvider>{children}</GlobalProvider>;
}
