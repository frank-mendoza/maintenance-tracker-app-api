import {
  Card,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Separator,
  Text,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { GridItemsList } from "../PropertyPage";
import { IProperty } from "@/types/property.types";
import MaintenanceStatus from "@/components/Status";

export const PropertyCardList = ({ data }: { data: IProperty }) => {
  return (
    <Link
      href={`/properties/${data._id}`}
      textDecoration="none"
      outline="none"
      bg={"white"}
      borderRadius={"md"}
      p={3}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Grid templateColumns={`repeat(9, 1fr)`} gap="5" alignItems={"center"}>
        <GridItem colSpan={1}>
          <Image
            borderRadius={"md"}
            height={"80px"}
            // width={"100%"}
            minWidth={200}
            objectFit={"cover"}
            src={data?.images?.[0]?.path || "https://placehold.co/400"}
            alt="Green double couch with wooden legs"
          />
        </GridItem>
        <GridItemsList
          label={"Apartment Name"}
          colSpan={2}
          type={<Text>{data?.name}</Text>}
        />
        <GridItemsList
          label={"Address"}
          colSpan={1}
          type={
            <Flex gap={2} alignItems={"center"}>
              <FiMapPin color="#a1a1aa" />
              <Text fontSize={12} color={"gray.400"}>
                {data?.location?.province} , {data?.location?.town}
              </Text>
            </Flex>
          }
        />

        <GridItemsList
          label={"Rent"}
          type={
            <Text fontSize={12} color={"gray.400"}>
              ${data?.rent} / {data.type}
            </Text>
          }
        />
        <GridItemsList
          label={"Type"}
          colSpan={2}
          type={
            <Flex gap={2} alignItems={"center"}>
              <MdApartment color="#a1a1aa" />
              <Text fontSize={12} color={"gray.400"}>
                {data.units} {data.type}
              </Text>
            </Flex>
          }
        />
        <GridItemsList
          label={"Status"}
          type={<MaintenanceStatus status={data?.status} />}
        />
      </Grid>
    </Link>
  );
};

const PropertyCard = ({ data }: { data: IProperty }) => {
  return (
    <Link
      href={`/properties/${data._id}`}
      textDecoration="none"
      outline="none"
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Card.Root minW={"100%"} overflow="hidden" p={4} border={0}>
        <Image
          borderRadius={"md"}
          width={"100%"}
          height={150}
          objectFit={"cover"}
          src={data?.images?.[0]?.path || "https://placehold.co/400"}
          alt="Green double couch with wooden legs"
        />
        <Card.Body gap="2" px={0}>
          <Flex gap={2}>
            <FiMapPin color="#a1a1aa" />
            <Text fontSize={12} color={"gray.400"}>
              {data?.location?.province},{data?.location?.town}
            </Text>
          </Flex>
          <Text fontSize={12} color={"gray.400"}>
            ${data?.rent} / {data.type}
          </Text>
          <Card.Title>{data?.name}</Card.Title>
          <Flex mt={2} justifyContent={"space-between"}>
            <Flex gap={2}>
              <MdApartment color="#a1a1aa" />
              <Text fontSize={12} color={"gray.400"}>
                {data?.units} Apartments
              </Text>
            </Flex>
            <MaintenanceStatus status={data?.status} />
          </Flex>
        </Card.Body>
        <Separator my={2} />
        <Card.Footer gap="2" p={0} justifyContent={"space-between"}>
          <Text color="#a1a1aa">Tenants</Text>
        </Card.Footer>
      </Card.Root>
    </Link>
  );
};

export default PropertyCard;
