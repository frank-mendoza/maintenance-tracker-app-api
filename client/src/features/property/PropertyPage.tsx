"use client";

import GroupedAvatars from "@/components/GroupedAvatars";
import SelectInput from "@/components/Select";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
  createListCollection,
  IconButton,
  Button,
  GridItem,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdApartment } from "react-icons/md";
import PropertyCard from "./components/PropertyCard";
import HorizontalCard from "@/components/HorizontalCard";
import DataFilter from "@/components/DataFilter";

const mockProperties = [
  {
    id: 1,
    name: "Sunset Villas",
    address: "123 Palm Street, Miami, FL",
    units: 12,
  },
  {
    id: 2,
    name: "Green Heights",
    address: "456 Oak Lane, Denver, CO",
    units: 8,
  },
  {
    id: 3,
    name: "Downtown Loft",
    address: "789 City Ave, New York, NY",
    units: 5,
  },
];

export const GridItemsList = ({
  label,
  type,
  colSpan,
}: {
  label: string;
  type: string | ReactNode;
  colSpan?: number;
}) => (
  <GridItem colSpan={colSpan || 1}>
    <Text fontSize={12} fontWeight={500} color={"gray.600"} mb={4}>
      {label}
    </Text>
    {type}
  </GridItem>
);

export const items = [
  {
    src: "https://cdn.myanimelist.net/r/84x124/images/characters/9/131317.webp?s=d4b03c7291407bde303bc0758047f6bd",
    name: "Uchiha Sasuke",
  },
  {
    src: "https://cdn.myanimelist.net/r/84x124/images/characters/7/284129.webp?s=a8998bf668767de58b33740886ca571c",
    name: "Baki Ani",
  },
  {
    src: "https://cdn.myanimelist.net/r/84x124/images/characters/9/105421.webp?s=269ff1b2bb9abe3ac1bc443d3a76e863",
    name: "Uchiha Chan",
  },
];

const PropertyCardList = () => {
  const grids = (
    <>
      <GridItem colSpan={1}>
        <Image
          borderRadius={"md"}
          // height={150}
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
        />
      </GridItem>
      <GridItemsList
        label={"Apartment Name"}
        colSpan={2}
        type={<Text>Living room Sofa</Text>}
      />
      <GridItemsList
        label={"Address"}
        type={
          <Flex gap={2} alignItems={"center"}>
            <FiMapPin color="#a1a1aa" />
            <Text fontSize={12} color={"gray.400"}>
              Virac
            </Text>
          </Flex>
        }
      />

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
        colSpan={2}
        type={
          <Flex gap={2} alignItems={"center"}>
            <MdApartment color="#a1a1aa" />
            <Text fontSize={12} color={"gray.400"}>
              4 Apartments
            </Text>
          </Flex>
        }
      />
      <GridItemsList
        label={"Status"}
        type={
          <Flex gap={2} alignItems={"center"}>
            <GoDotFill size={24} color="#6fe099" />
            <Text color={"#6fe099"}>Rent</Text>
          </Flex>
        }
      />
      <GridItemsList
        label={"Tenants"}
        type={<GroupedAvatars items={items} />}
      />
    </>
  );

  return (
    <HorizontalCard route="/properties/1" templateColumns={9} grids={grids} />
  );
};

export default function PropertiesPage() {
  const [gridType, setGridType] = useState<1 | 2>(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ property: "", status: "" });

  const frameworks = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  });
  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Properties</Heading>
      </Flex>

      <DataFilter
        actions={
          <Button p={4}>
            <BiPlus /> Add property
          </Button>
        }
        actionButtons={
          <>
            {" "}
            <IconButton
              onClick={() => setGridType(1)}
              variant={gridType === 1 ? "solid" : "subtle"}
              aria-label="Call support"
            >
              <CiGrid41 size={60} />
            </IconButton>
            <IconButton
              onClick={() => setGridType(2)}
              variant={gridType === 2 ? "solid" : "subtle"}
              aria-label="Call support"
            >
              <CiBoxList size={60} />
            </IconButton>
          </>
        }
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        isOpen={isOpen}
        onOpenFilter={(e) => setIsOpen(e.open)}
        title={"Properties"}
        filters={
          <>
            <SelectInput
              label={"Type"}
              placeholder="Select type"
              items={frameworks}
            />
            <SelectInput
              label={"Location"}
              placeholder="Select location"
              items={frameworks}
            />
          </>
        }
        onCLoseFilter={() => {
          setFilters({ property: "", status: "" });
          setSearch("");
          setIsOpen(false);
        }}
        onSubmitFilter={() => ""}
      />

      {gridType === 1 ? (
        <SimpleGrid
          mt={4}
          transition={"all ease-in-out"}
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          gap={6}
        >
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid
          mt={4}
          transition={"all ease-in-out"}
          columns={{ base: 1 }}
          gap={6}
        >
          {mockProperties.map((property) => (
            <PropertyCardList key={property.id} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
