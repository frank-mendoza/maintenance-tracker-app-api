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
  Center,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdApartment } from "react-icons/md";
import PropertyCard from "./components/PropertyCard";
import HorizontalCard from "@/components/HorizontalCard";
import DataFilter from "@/components/DataFilter";
import { fetchProperties } from "@/lib/api/property";
import { toaster } from "@/components/ui/toaster";
import { IProperty } from "@/types/property.types";

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

const PropertyCardList = ({ data }: { data: IProperty }) => {
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
        type={<Text>{data?.name}</Text>}
      />
      <GridItemsList
        label={"Address"}
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
        type={
          <Flex gap={2} alignItems={"center"}>
            <GoDotFill size={24} color="#6fe099" />
            <Text fontSize={14} textTransform={"capitalize"} color={"#6fe099"}>
              {data?.status}
            </Text>
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
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [gridType, setGridType] = useState<1 | 2>(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    property: "",
    status: "",
    sort: "",
  });
  const [filtersTemp, setFiltersTemp] = useState({
    property: [],
    status: [],
    sort: [],
  });

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler); // Cleanup on input change
  }, [search]);

  useEffect(() => {
    (async () => {
      const query: any = {
        ...filters,
      };

      if (debouncedSearch) query.search = debouncedSearch;

      const res: any = await fetchProperties(query);

      if (res.error) {
        toaster.create({
          description: res?.msg || "Error fetching data!",
          type: "error",
        });
      } else {
        setProperties(res.properties);
      }
    })();
  }, [filters, debouncedSearch]);

  const apartmentTypes = createListCollection({
    items: [
      { label: "Apartment", value: "apartment" },
      { label: "Transcient House / House", value: "house" },
      { label: "Boarding House", value: "boarding house" },
      { label: "Condo", value: "condo" },
    ],
  });

  const sorts = createListCollection({
    items: [
      { label: "Latest", value: "newest" },
      { label: "Oldest", value: "oldest" },
      { label: "A-Z", value: "a-z" },
      { label: "Z-A", value: "z-a" },
    ],
  });
  const status = createListCollection({
    items: [
      { label: "Pending", value: "pending" },
      { label: "In progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
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
              placeholder="Select apartment type"
              items={apartmentTypes}
              onChange={(e: any) =>
                setFiltersTemp({
                  ...filtersTemp,
                  property: e.value,
                })
              }
              value={filtersTemp.property}
            />
            <SelectInput
              label={"Sort"}
              placeholder="Sort by"
              items={sorts}
              onChange={(e: any) =>
                setFiltersTemp({
                  ...filtersTemp,
                  sort: e.value,
                })
              }
              value={filtersTemp.sort}
            />
            <SelectInput
              label={"Status"}
              placeholder="Select status"
              items={status}
              onChange={(e: any) =>
                setFiltersTemp({
                  ...filtersTemp,
                  status: e.value,
                })
              }
              value={filtersTemp.status}
            />
          </>
        }
        onCLoseFilter={() => {
          setFilters({ property: "", status: "", sort: "" });
          setFiltersTemp({ property: [], status: [], sort: [] });
          setSearch("");
          setIsOpen(false);
        }}
        onSubmitFilter={() => {
          setFilters({
            property: filtersTemp.property[0] || "",
            status: filtersTemp.status[0] || "",
            sort: filtersTemp.sort[0] || "",
          });
          setIsOpen(false);
        }}
      />

      {gridType === 1 ? (
        <SimpleGrid
          mt={4}
          transition={"all ease-in-out"}
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          gap={6}
        >
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} data={property} />
            ))
          ) : (
            <GridItem>
              <Center>No data available</Center>
            </GridItem>
          )}
        </SimpleGrid>
      ) : (
        <SimpleGrid
          mt={4}
          transition={"all ease-in-out"}
          columns={{ base: 1 }}
          gap={6}
        >
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCardList key={property._id} data={property} />
            ))
          ) : (
            <Center>No data available</Center>
          )}
        </SimpleGrid>
      )}
    </Box>
  );
}
