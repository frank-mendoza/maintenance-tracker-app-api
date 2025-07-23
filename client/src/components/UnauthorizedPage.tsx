"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function UnauthorizedPage() {
  return (
    <Box
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <VStack gap={6} textAlign="center">
        <Heading size="xl" color="red.500">
          🚫 Unauthorized
        </Heading>
        <Text fontSize="md" color="gray.600">
          You don’t have permission to view this content.
        </Text>
        {/* <Button colorScheme="blue" onClick={() => router.push("/")}>
          Go back home
        </Button> */}
      </VStack>
    </Box>
  );
}
