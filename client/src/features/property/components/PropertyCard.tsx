import GroupedAvatars from "@/components/GroupedAvatars";
import {
  Card,
  Flex,
  Image,
  Link,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdApartment } from "react-icons/md";
import { items } from "../PropertyPage";

const PropertyCard = () => {
  return (
    <Link
      href="/properties/1"
      textDecoration="none"
      outline="none"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Card.Root overflow="hidden" p={4} border={0}>
        <Image
          borderRadius={"md"}
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
        />
        <Card.Body gap="2">
          <Flex mt={2} justifyContent={"space-between"}>
            <Flex gap={2}>
              <FiMapPin color="#a1a1aa" />
              <Text fontSize={12} color={"gray.400"}>
                Virac
              </Text>
            </Flex>
            <Text fontSize={12} color={"gray.400"}>
              $300 / Flat
            </Text>
          </Flex>
          <Card.Title>Living room Sofa</Card.Title>
          <Flex mt={2} justifyContent={"space-between"}>
            <Flex gap={2}>
              <MdApartment color="#a1a1aa" />
              <Text fontSize={12} color={"gray.400"}>
                4 Apartments
              </Text>
            </Flex>
            <Flex>
              <GoDotFill size={24} color="#6fe099" />
              <Text color={"#6fe099"}>Rent</Text>
            </Flex>
          </Flex>
        </Card.Body>
        <Separator my={2} />
        <Card.Footer gap="2" pt={2} justifyContent={"space-between"}>
          <Text color="#a1a1aa">Tenants</Text>
          <Stack>
            <GroupedAvatars items={items} />
          </Stack>
        </Card.Footer>
      </Card.Root>
    </Link>
  );
};

export default PropertyCard;
