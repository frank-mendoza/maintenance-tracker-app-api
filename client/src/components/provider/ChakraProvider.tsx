"use client";

import { Box, Flex } from "@chakra-ui/react";
import { MainProvider } from "../provider/MainProvider";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useEffect } from "react";
import { fetchUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { Loading } from "../Loading";

const GlobalProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setUser, loading, setLoading, clearUser } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await fetchUser();
      if (user.status !== 200) {
        router.push("/login");
        clearUser();
      } else {
        setUser(user.data.user);
      }
      setLoading(false);
    })();
  }, [router, setUser, setLoading, clearUser]);

  if (loading) return <Loading />;
  return (
    <MainProvider>
      <Flex minH="100vh">
        <Sidebar />
        <Box flex="1" p={6} bg="gray.50" width={"calc(100% - 240px)"}>
          <Navbar />

          {children}
        </Box>
      </Flex>
    </MainProvider>
  );
};
export default GlobalProvider;
