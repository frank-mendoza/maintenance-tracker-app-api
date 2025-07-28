"use client";

import SelectInput from "@/components/Select";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  createListCollection,
  IconButton,
  GridItem,
  Center,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { CiBoxList, CiGrid41 } from "react-icons/ci";
import PropertyCard from "./components/PropertyCard";
import DataFilter from "@/components/DataFilter";
import { fetchProperties } from "@/lib/api/property";
import { toaster } from "@/components/ui/toaster";
import { IProperty } from "@/types/property.types";
import PropertyForm from "./components/PropertyForm";
import { Tooltip } from "@/components/ui/tooltip";
import DataTable from "@/components/DataTable";
import { FaEye } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import { useRouter } from "next/navigation";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import useGlobalStore from "@/lib/store/useGlobalStore";
import PropertyStatusBadge from "./components/PropertyStatusbadge";
import moment from "moment";

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

function PropertyComponent() {
  const router = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [gridType, setGridType] = useState<1 | 2>(() => {
    const stored = localStorage.getItem("grid_type");
    const parsed = stored === "2" ? 2 : 1;
    return parsed;
  });
  const [refetch, setRefetch] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
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
    if (gridType === 1) {
      const handler = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500); // 500ms debounce

      return () => clearTimeout(handler); // Cleanup on input change
    }
  }, [search, gridType]);

  useEffect(() => {
    if (loading && gridType === 1) {
      (async () => {
        setLoading(true);
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
          setProperties(res?.data || []);
        }
        setLoading(false);
      })();
    }
  }, [filters, debouncedSearch, loading, gridType]);

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

  const columns: any[] = [
    { key: "index", label: "ID", sortable: true },
    { key: "name", label: "Property Name", sortable: true },
    { key: "rent", label: "Property Price" },
    { key: "type", label: "Property Type" },
    { key: "description", label: "Decription" },
    { key: "units", label: "Number of Units" },
    {
      key: "status",
      label: "Status",
      render: (item: any) => <PropertyStatusBadge item={item} />,
    },
    {
      key: "createdAt",
      label: "Date Created",
      render: (item: IProperty) => (
        <>{moment(item.createdAt).format("MMM D YYYY")}</>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <>
          {/* <IconButton
              variant="ghost"
              aria-label="Edit"
              onClick={() => console.log("Edit", row)}
            >
              <BiPencil />
            </IconButton> */}
          <IconButton
            variant="ghost"
            aria-label="View"
            onClick={() => router.push(`/properties/${row._id}`)}
          >
            <FaEye />{" "}
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Delete"
            onClick={
              () => {}
              // setIsRemove({
              //   show: true,
              //   user: row,
              // })
            }
          >
            <BiTrash color="red" />
          </IconButton>
        </>
      ),
    },
  ];

  const filterNumber = Object.values(filters).filter(
    (val) => typeof val === "string" && val.trim() !== ""
  ).length;

  const filtersFields = (
    <>
      <SelectInput
        vertical
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
        vertical
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
        vertical
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
  );

  const onRefresh = () => {
    if (filterNumber > 0) {
      setFilters({ type: "", status: "", sort: "" });
      setFiltersTemp({ type: [], status: [], sort: [] });
    }

    if (search.length > 0) {
      setSearch("");
    }
    setLoading(true);
    setRefetch(true);
  };

  const onSubmitFilter = () => {
    setFilters({
      type: filtersTemp.type[0] || "",
      status: filtersTemp.status[0] || "",
      sort: filtersTemp.sort[0] || "",
    });
    setIsOpen(false);
    setLoading(true);
    setRefetch(true);
  };

  const actionButtons = (
    <>
      <Tooltip showArrow content="Card view">
        <IconButton
          onClick={() => {
            localStorage.setItem("grid_type", `${1}`);
            setGridType(1);
          }}
          variant={gridType === 1 ? "solid" : "subtle"}
          aria-label="GRIDS"
        >
          <CiGrid41 size={60} />
        </IconButton>
      </Tooltip>
      <Tooltip showArrow content="Grid view">
        <IconButton
          onClick={() => {
            localStorage.setItem("grid_type", `${2}`);
            setGridType(2);
          }}
          variant={gridType === 2 ? "solid" : "subtle"}
          aria-label="LIST"
        >
          <CiBoxList size={60} />
        </IconButton>
      </Tooltip>
    </>
  );

  const dataFilter = (
    <DataFilter
      actions={
        <PropertyForm
          type="create"
          setTrigger={setLoading}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
        />
      }
      onRefresh={onRefresh}
      onOpenFilter={(e) => setIsOpen(e.open)}
      onSearchChange={(e) => setSearch(e.target.value)}
      actionButtons={actionButtons}
      title={"Properties"}
      search={search}
      isOpen={isOpen}
      filterNumber={filterNumber}
      filters={filtersFields}
      onCLoseFilter={() => setIsOpen(false)}
      onSubmitFilter={onSubmitFilter}
    />
  );

  const renderDataList = () => {
    if (gridType === 1) {
      if (loading)
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

      return (
        <>
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
        </>
      );
    }

    return (
      <DataTable
        isReset={isReset}
        setIsReset={setIsReset}
        refetch={refetch}
        setRefetch={setRefetch}
        filters={{ ...filters, search }}
        filterComponent={dataFilter}
        columns={columns}
        source={fetchProperties}
      />
    );
  };

  return (
    <Box p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Properties</Heading>
      </Flex>

      {gridType === 1 && dataFilter}
      {renderDataList()}
    </Box>
  );
}

export default function PropertiesPage() {
  const { user } = useGlobalStore();
  if (user?.role !== "landlord") return <UnauthorizedPage />;

  return <PropertyComponent />;
}
