/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import useGlobalStore from "@/lib/store/useGlobalStore";
import {
  Box,
  Card,
  Flex,
  For,
  Heading,
  HStack,
  Icon,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaUsers, FaBuilding, FaTools, FaClock } from "react-icons/fa";

const OverviewComponent = () => {
  const overviews = [
    {
      label: "Tenants",
      count: 10,
      icon: FaUsers,
      color: "#FAD59A",
    },
    {
      label: "Properties",
      count: 10,
      icon: FaBuilding,
      color: "#C1DBB3",
    },
    {
      label: "Maintenance Logs",
      count: 10,
      icon: FaTools,
      color: "#8DD8FF",
    },
  ];
  const cardBg = useColorModeValue("white", "gray.800");

  const actions = [
    {
      icon: FaUsers,
      description: "New tenant registered",
      timestamp: "2h ago",
      color: "#FAD59A",
    },
    {
      icon: FaTools,
      description: "Plumbing issue logged",
      timestamp: "5h ago",
      color: "#8DD8FF",
    },
    {
      icon: FaBuilding,
      description: "New property added",
      timestamp: "1d ago",
      color: "#C1DBB3",
    },
  ];

  const RecentActionItem = ({
    icon,
    description,
    timestamp,
    color,
  }: {
    icon: any;
    color?: string;
    description: string;
    timestamp: string;
  }) => (
    <Flex
      justify="space-between"
      align="center"
      py={4}
      cursor="pointer"
      borderBottom="1px solid #e4e4e7d6"
      transition="all 0.2s"
      _hover={{ backgroundColor: "gray.100", paddingLeft: 2, paddingRight: 2 }}
    >
      <HStack>
        <Icon as={icon} size={"xs"} color={color} boxSize={5} />
        <Text fontSize="sm" fontWeight={500} color={"gray.600"}>
          {description}
        </Text>
      </HStack>
      <Text fontSize="xs" color="gray.500">
        {timestamp}
      </Text>
    </Flex>
  );

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Overview
      </Heading>
      <Stack gap="4" direction="row" wrap="wrap">
        <For each={overviews}>
          {(variant) => (
            <Card.Root
              width="250px"
              variant={"elevated"}
              key={variant.label}
              bg={cardBg}
              boxShadow="sm"
              borderRadius="lg"
              p={6}
              transition="all 0.2s"
              _hover={{ boxShadow: "md" }}
            >
              <Card.Body gap="2">
                <Flex align="center" mb={4} gap={"2"}>
                  <Box
                    p={2}
                    bg={variant.color}
                    color={"white"}
                    borderRadius={"sm"}
                  >
                    {<variant.icon size={16} />}
                  </Box>
                  <Heading fontSize="md" fontWeight={500}>
                    {variant.label}
                  </Heading>
                </Flex>
                <Text fontSize="2xl" fontWeight="bold">
                  {variant.count}
                </Text>
              </Card.Body>
            </Card.Root>
          )}
        </For>
      </Stack>

      <Box
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="md"
        borderRadius="lg"
        p={6}
        mt={8}
      >
        <Flex align="center" mb={4}>
          <Icon as={FaClock} w={5} h={5} color="#3D90D7" mr={2} />
          <Heading size="md">Recent Actions</Heading>
        </Flex>
        <Separator />
        <VStack align="stretch" gap={0}>
          {actions.map((action, idx) => (
            <RecentActionItem key={idx} {...action} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default function OverviewPage() {
  const { user } = useGlobalStore();
  if (user?.role !== "landlord") return <UnauthorizedPage />;

  return <OverviewComponent />;
}
