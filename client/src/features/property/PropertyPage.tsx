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
  GridItem,
  Center,
  VStack,
  Spinner,
  Grid,
  Link,
} from "@chakra-ui/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { MdApartment } from "react-icons/md";
import PropertyCard from "./components/PropertyCard";
import DataFilter from "@/components/DataFilter";
import { fetchProperties } from "@/lib/api/property";
import { toaster } from "@/components/ui/toaster";
import { IProperty } from "@/types/property.types";
import useGlobalStore from "@/lib/store/useGlobalStore";
import PropertyForm from "./components/PropertyForm";

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
            width={200}
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
          type={
            <Flex gap={2} alignItems={"center"}>
              <GoDotFill size={24} color="#6fe099" />
              <Text
                fontSize={14}
                textTransform={"capitalize"}
                color={"#6fe099"}
              >
                {data?.status}
              </Text>
            </Flex>
          }
        />
        <GridItemsList
          label={"Tenants"}
          type={<GroupedAvatars items={items} />}
        />
      </Grid>
    </Link>
  );
};

export default function PropertiesPage() {
  const { loadingSpiner, setLoadingSpinner } = useGlobalStore();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [gridType, setGridType] = useState<1 | 2>(() => {
    const stored = localStorage.getItem("grid_type");
    const parsed = stored === "2" ? 2 : 1;
    return parsed;
  });
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    sort: "",
  });
  const [filtersTemp, setFiltersTemp] = useState({
    type: [],
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

  const fetchUsers = useCallback(async () => {
    setLoadingSpinner(true);
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
      setProperties(res?.properties || []);
    }
    setLoadingSpinner(false);
  }, [filters, debouncedSearch, isOpenDialog]);

  useEffect(() => {
    fetchUsers();
  }, [filters, debouncedSearch, fetchUsers]);

  const apartmentTypes = createListCollection({
    items: [
      { label: "Apartment", value: "apartment" },
      { label: "Transcient House / House", value: "house" },
      { label: "Boarding House", value: "boarding house" },
      { label: "Condo", value: "condo" },
      { label: "All", value: "" },
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
      { label: "All", value: "" },
    ],
  });

  const renderDataList = () => {
    if (!isOpenDialog && loadingSpiner)
      return (
        <VStack py={5} mt={5}>
          <Spinner
            color="red.500"
            css={{ "--spinner-track-color": "colors.gray.200" }}
          />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      );

    if (!properties || properties.length === 0) {
      return <Center my={8}>No data available</Center>;
    }
    if (gridType === 1) {
      return (
        <SimpleGrid
          mt={4}
          transition={"all ease-in-out"}
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          gap={6}
        >
          {properties.map((property) => (
            <PropertyCard key={property._id} data={property} />
          ))}
        </SimpleGrid>
      );
    }

    return (
      <SimpleGrid
        mt={4}
        transition={"all ease-in-out"}
        columns={{ base: 1 }}
        gap={6}
      >
        {properties.map((property) => (
          <PropertyCardList key={property._id} data={property} />
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Properties</Heading>
      </Flex>

      <DataFilter
        actions={
          <PropertyForm
            type="create"
            isOpenDialog={isOpenDialog}
            setIsOpenDialog={setIsOpenDialog}
          />
        }
        actionButtons={
          <>
            {" "}
            <IconButton
              onClick={() => {
                localStorage.setItem("grid_type", `${1}`);
                setGridType(1);
              }}
              variant={gridType === 1 ? "solid" : "subtle"}
              aria-label="Call support"
            >
              <CiGrid41 size={60} />
            </IconButton>
            <IconButton
              onClick={() => {
                localStorage.setItem("grid_type", `${2}`);
                setGridType(2);
              }}
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
        filterNumber={
          Object.values(filters).filter(
            (val) => typeof val === "string" && val.trim() !== ""
          ).length
        }
        filters={
          <>
            <SelectInput
              center
              mb
              label={"Type"}
              placeholder="Select apartment type"
              items={apartmentTypes}
              onChange={(e: any) =>
                setFiltersTemp({
                  ...filtersTemp,
                  type: e.value,
                })
              }
              value={filtersTemp.type}
            />
            <SelectInput
              center
              mb
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
              center
              mb
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
          setFilters({ type: "", status: "", sort: "" });
          setFiltersTemp({ type: [], status: [], sort: [] });
          setSearch("");
          setIsOpen(false);
        }}
        onSubmitFilter={() => {
          setFilters({
            type: filtersTemp.type[0] || "",
            status: filtersTemp.status[0] || "",
            sort: filtersTemp.sort[0] || "",
          });
          setIsOpen(false);
        }}
      />

      {renderDataList()}
    </Box>
  );
}
