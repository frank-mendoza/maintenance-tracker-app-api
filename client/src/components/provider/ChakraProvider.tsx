"use client";

import { Box, Flex } from "@chakra-ui/react";
import { MainProvider } from "../provider/MainProvider";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const GlobalProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
