"use client";
import DataFilter from "@/components/DataFilter";
/* eslint-disable @typescript-eslint/no-explicit-any */

import DataTable from "@/components/DataTable";
import SelectInput from "@/components/Select";
import { fetchUsers, removeUser } from "@/lib/api/user";
import {
  Box,
  createListCollection,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import TenantsForm from "./components/TenantsForm";
import useGlobalStore from "@/lib/store/useGlobalStore";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { User } from "@/types/user.type";
import UserStatusbadge from "./components/UserStatusbadge";
import moment from "moment";
import RemoveModal from "@/components/modals/RemoveModal";
import { useRouter } from "next/navigation";

function TenantsPage() {
  const router = useRouter();
  const [refetch, setRefetch] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRemove, setIsRemove] = useState<{
    show: boolean;
    data: User | null;
  }>({
    show: false,
    data: null,
  });
  const [filters, setFilters] = useState<{
    role: string;
    status: string;
    sort?: string | null;
  }>({ role: "", status: "" });
  const [filtersTemp, setFiltersTemp] = useState({
    status: [],
    role: [],
  });
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const columns = [
    // { key: "index", label: "ID", sortable: true },
    { key: "name", label: "First Name", sortable: true },
    { key: "lastName", label: "Last Name" },
    { key: "role", label: "Role" },
    { key: "email", label: "Email" },
    {
      key: "isVerified",
      label: "Verified User",
      render: (item: User) => (
        <UserStatusbadge isVerified={item.isVerified as boolean} />
      ),
    },
    {
      key: "createdAt",
      label: "Date Created",
      render: (item: User) => (
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
              setUserDetails(row);
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

  const roles = createListCollection({
    items: [
      { label: "Tenant", value: "tenant" },
      { label: "Landlord", value: "landlord" },
      { label: "Technician", value: "technician" },
    ],
  });
  const status = createListCollection({
    items: [
      { label: "Verified", value: "verified" },
      { label: "Unverified", value: "unverified" },
    ],
  });

  const filterNumber = Object.values(filters).filter(
    (val) => typeof val === "string" && val.trim() !== ""
  ).length;

  const filtersFields = (
    <>
      <SelectInput
        vertical
        mb
        label={"Role"}
        placeholder="Select role type"
        items={roles}
        onChange={(e: any) =>
          setFiltersTemp({
            ...filtersTemp,
            role: e.value,
          })
        }
        value={filtersTemp.role}
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

  const filterComponent = (
    <DataFilter
      actions={
        <TenantsForm
          type={userDetails ? "update" : "create"}
          details={userDetails}
          setTrigger={setRefetch}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          setUserDetails={setUserDetails}
        />
      }
      setIsOpen={setIsOpen}
      onSearchChange={(e) => setSearch(e.target.value)}
      onRefresh={() => {
        if (filterNumber > 0) {
          setFilters({ role: "", status: "", sort: null });
          setFiltersTemp({ role: [], status: [] });
        }

        if (search.length > 0) {
          setSearch("");
        }
        setIsReset(true);
        setRefetch(true);
      }}
      title={"Tenants"}
      search={search}
      isOpen={isOpen}
      filters={filters}
      filtersFields={filtersFields}
      onSubmitFilter={() => {
        setFilters({
          ...filters,
          role: filtersTemp.role[0] || "",
          status: filtersTemp.status[0] || "",
        });
        setIsOpen(false);
        setRefetch(true);
      }}
    />
  );

  return (
    <Box px={0} py={8}>
      <Flex gap={2} alignItems="center" mb={4}>
        <Heading size="lg">Users</Heading>
      </Flex>
      <DataTable
        isReset={isReset}
        setIsReset={setIsReset}
        refetch={refetch}
        setRefetch={setRefetch}
        filters={{ ...filters, search }}
        filterComponent={filterComponent}
        columns={columns}
        source={fetchUsers}
      />
      <RemoveModal
        setLoading={setRefetch}
        setIsRemove={setIsRemove}
        isRemove={isRemove}
        loading={refetch}
        endpoint={removeUser}
      >
        <Dialog.Header>
          <Dialog.Title>Remove User</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Text>
            Are you sure you want to remove{" "}
            <strong>
              {" "}
              {isRemove?.data?.name} {isRemove?.data?.lastName}
            </strong>
            ?
          </Text>
        </Dialog.Body>
      </RemoveModal>
    </Box>
  );
}

export default function Tenants() {
  const { user } = useGlobalStore();
  if (user?.role !== "landlord") return <UnauthorizedPage />;

  return <TenantsPage />;
}
