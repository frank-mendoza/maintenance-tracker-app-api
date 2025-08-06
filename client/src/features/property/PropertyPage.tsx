"use client";

import SelectInput from "@/components/Select";
import {
  Box,
  Heading,
  Text,
  Flex,
  createListCollection,
  IconButton,
  GridItem,
  Dialog,
  Image,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import DataFilter from "@/components/DataFilter";
import { fetchProperties, removeProperty } from "@/lib/api/property";
import { IProperty } from "@/types/property.types";
import PropertyForm from "./components/PropertyForm";
import DataTable from "@/components/DataTable";
import { FaEye } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import useGlobalStore from "@/lib/store/useGlobalStore";
import moment from "moment";
import RemoveModal from "@/components/modals/RemoveModal";
import { useRouter } from "next/navigation";

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

function PropertyComponent() {
  const router = useRouter();
  const [details, setDetails] = useState<IProperty | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const [refetch, setRefetch] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRemove, setIsRemove] = useState<{
    show: boolean;
    data: IProperty | null;
  }>({
    show: false,
    data: null,
  });
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
    {
      key: "name",
      label: "Property Name",
      sortable: true,
      render: (item: IProperty) => {
        if (item.images?.length === 0)
          return (
            <Image
              borderRadius={"sm"}
              h={30}
              w={30}
              src={"https://bit.ly/broken-link"}
              alt=""
            />
          );
        return (
          <Flex alignItems={"center"} gap={2}>
            <Image
              borderRadius={"sm"}
              h={30}
              w={30}
              src={
                item?.images && item.images.length > 0
                  ? item.images[0]?.path
                  : ""
              }
              alt=""
            />
            <Text>{item.name}</Text>
          </Flex>
        );
      },
    },
    { key: "rent", label: "Property Price" },
    { key: "type", label: "Property Type" },
    { key: "description", label: "Decription" },
    { key: "units", label: "Number of Units" },
    // {
    //   key: "status",
    //   label: "Status",
    //   render: (item: any) => <PropertyStatusBadge item={item} />,
    // },
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
            onClick={() => {
              setDetails(row);
              setIsOpenDialog(true);
              router.replace(`${window.location.pathname}?id=${row._id}`);
            }}
          >
            <FaEye />{" "}
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Delete"
            onClick={() =>
              setIsRemove({
                show: true,
                data: row,
              })
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
    setRefetch(true);
  };

  const onSubmitFilter = () => {
    setFilters({
      type: filtersTemp.type[0] || "",
      status: filtersTemp.status[0] || "",
      sort: filtersTemp.sort[0] || "",
    });
    setIsOpen(false);
    setRefetch(true);
  };

  const dataFilter = (
    <DataFilter
      actions={
        <PropertyForm
          details={details}
          type={details ? "update" : "create"}
          setTrigger={setRefetch}
          isOpenDialog={isOpenDialog}
          setDetails={setDetails}
          setIsOpenDialog={setIsOpenDialog}
        />
      }
      onRefresh={onRefresh}
      setIsOpen={setIsOpen}
      onSearchChange={(e) => setSearch(e.target.value)}
      title={"Properties"}
      search={search}
      isOpen={isOpen}
      filtersFields={filtersFields}
      filters={filters}
      onSubmitFilter={onSubmitFilter}
    />
  );

  const renderDataList = () => {
    return (
      <>
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

        <RemoveModal
          setLoading={setRefetch}
          setIsRemove={setIsRemove}
          isRemove={isRemove}
          loading={refetch}
          endpoint={removeProperty}
        >
          <Dialog.Header>
            <Dialog.Title>Remove Property</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>
              Are you sure you want to remove{" "}
              <strong> {isRemove?.data?.name}</strong>?
            </Text>
          </Dialog.Body>
        </RemoveModal>
      </>
    );
  };

  return (
    <Box py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Properties</Heading>
      </Flex>

      {renderDataList()}
    </Box>
  );
}

export default function PropertiesPage() {
  const { user } = useGlobalStore();
  if (user?.role !== "landlord") return <UnauthorizedPage />;

  return <PropertyComponent />;
}
