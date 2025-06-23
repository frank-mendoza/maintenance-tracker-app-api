"use client";
import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Grid,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { GridItemsList, items } from "./PropertyPage";
import { MdApartment } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import GroupedAvatars from "@/components/GroupedAvatars";
import PropertyCard from "./components/PropertyCard";

const PropertyProfile = () => {
  return (
    <Box>
      <Box maxW="6xl" mx="auto">
        <Heading size="lg" mb={6}>
          Property Profile
        </Heading>

        <Flex gap={8} flexWrap="wrap">
          {/* Left: Main Image & Thumbnails */}
          <Box flex="1" minW="300px">
            <Box h="300px" bg="gray.200" borderRadius="xl" mb={4} />
            <HStack gap={3}>
              <Box w="24" h="20" bg="gray.100" borderRadius="xl" />
              <Box w="24" h="20" bg="gray.100" borderRadius="xl" />
              <Box w="24" h="20" bg="gray.100" borderRadius="xl" />
            </HStack>
          </Box>

          {/* Right: Details */}
          <Box flex="1" minW="300px">
            <Heading size="xl" mb={1}>
              Virac
            </Heading>
            <Flex alignItems={"center"} gap={2}>
              <FiMapPin color="#a1a1aa" />
              <Text color="gray.400">Virac, Catsu</Text>
            </Flex>

            <Box my={5}>
              <Heading size={"md"} mb={2}>
                Property Details
              </Heading>
              <Text fontSize="sm" color="gray.400" mb={4}>
                Nestled among tall pine trees, Whispering Pines Estate offers a
                serene and peaceful living environment.
              </Text>
            </Box>

            <Grid
              templateColumns="repeat(2, 1fr)"
              gap="5"
              alignItems={"center"}
            >
              <GridItemsList
                label={"Rent"}
                type={
                  <Text fontSize={12} color={"gray.400"}>
                    $300 / Flat
                  </Text>
                }
              />
              <GridItemsList
                label={"Type"}
                type={
                  <Flex gap={2} alignItems={"start"}>
                    <MdApartment color="#a1a1aa" />
                    <Text fontSize={12} color={"gray.400"}>
                      4 Apartments
                    </Text>
                  </Flex>
                }
              />
              <GridItemsList
                label={"Maintenance Status"}
                type={
                  <Flex gap={2} alignItems={"start"}>
                    <GoDotFill size={24} color="#6fe099" />
                    <Text color={"#6fe099"}>Rent</Text>
                  </Flex>
                }
              />
              <GridItemsList
                label={"Tenants"}
                type={<GroupedAvatars items={items} />}
              />
            </Grid>
          </Box>
        </Flex>

        <Box mt={10} mb={4}>
          <Heading size={"md"} mb={2}>
            Recently Added
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
            {[1, 2, 3].map((property) => (
              <PropertyCard key={property} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyProfile;
