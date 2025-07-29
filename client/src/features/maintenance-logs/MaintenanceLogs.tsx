"use client";
import DataFilter from "@/components/DataFilter";
/* eslint-disable @typescript-eslint/no-explicit-any */

import DataTable from "@/components/DataTable";
import SelectInput from "@/components/Select";
import {
  Box,
  createListCollection,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import useGlobalStore from "@/lib/store/useGlobalStore";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { User } from "@/types/user.type";
import moment from "moment";
import PropertyStatusBadge from "../property/components/PropertyStatusbadge";
import { MaintenanceLog } from "@/types/maintenance.types";
import { fetchTicketLogs } from "@/lib/api/maintenance";
import TicketsForm from "./components/TicketsForm";
import RemovePopup from "../tenants/components/RemovePopup";
import {
  PROPERTY_STATUS,
  ROLES_TYPES,
  TicketStatus,
} from "@/constants/constants";
import UpdateTicketStatus from "./components/UpdateTicketStatus";

function MaintenanceLogs() {
  const { user } = useGlobalStore();

  const isTechnician = user?.role === ROLES_TYPES.TECH;
  const [refetch, setRefetch] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isRemove, setIsRemove] = useState({
    show: false,
    user: null,
  });
  const [filters, setFilters] = useState<{
    role: string;
    status: string;
    sort?: string | null;
    assignedTo?: string | null;
    reportedBy?: string | null;
  }>({
    role: "",
    status: "",
  });
  const [filtersTemp, setFiltersTemp] = useState({
    status: [],
    role: [],
  });
  const [details, setDetails] = useState<MaintenanceLog | null>(null);
  const [updateTicket, setUpdateTicket] = useState<{
    show: boolean;
    ticket: MaintenanceLog | null;
    isDiscarded?: boolean;
  }>({
    show: false,
    ticket: null,
  });

  const columns: any[] = [
    { key: "index", label: "ID", sortable: true },
    { key: "title", label: "Ticket Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "property.name", label: "Property Name" },
    {
      key: "assignedTo.email",
      label: "Assigned To",
      render: (item: MaintenanceLog) => (
        <>
          <Text>
            {item.assignedTo.name} {item.assignedTo.lastName}
          </Text>
          <Text>{item.assignedTo.email} </Text>
        </>
      ),
    },
    {
      key: "reportedBy.email",
      label: "Reported By",
      render: (item: MaintenanceLog) => (
        <>
          <Text>
            {item.reportedBy.name} {item.reportedBy.lastName}
          </Text>
          <Text>{item.reportedBy.email} </Text>
        </>
      ),
    },
    {
      key: "status",
      label: "Ticket Status",
      render: (item: MaintenanceLog) => <PropertyStatusBadge item={item} />,
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
              if (isTechnician) {
                setUpdateTicket({
                  show: true,
                  ticket: row,
                });
              } else {
                setDetails(row);
                setIsOpenDialog(true);
              }
            }}
          >
            <FaEye />{" "}
          </IconButton>
          {(row.status === PROPERTY_STATUS.in_progress.value ||
            row.status === PROPERTY_STATUS.pending.value) &&
            user?.role === ROLES_TYPES.TECH && (
              <IconButton
                variant="ghost"
                aria-label="Delete"
                onClick={() =>
                  setUpdateTicket({
                    show: true,
                    ticket: row,
                    isDiscarded: true,
                  })
                }
              >
                <BiTrash color="red" />
              </IconButton>
            )}
        </>
      ),
    },
  ];

  const status = createListCollection({
    items: TicketStatus,
  });

  const filterNumber = Object.values(filters).filter(
    (val) => typeof val === "string" && val.trim() !== ""
  ).length;

  const filtersFields = (
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
  );

  const onRefresh = () => {
    if (filterNumber > 0) {
      setFilters({ role: "", status: "", sort: null });
      setFiltersTemp({ role: [], status: [] });
    }

    if (search.length > 0) {
      setSearch("");
    }
    setIsReset(true);
    setRefetch(true);
  };

  const filterComponent = (
    <DataFilter
      actions={
        <TicketsForm
          type={details ? "update" : "create"}
          details={details}
          setTrigger={setRefetch}
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
          setDetails={setDetails}
        />
      }
      setIsOpen={setIsOpen}
      onSearchChange={(e) => setSearch(e.target.value)}
      onRefresh={onRefresh}
      title={"Maintenance Logs"}
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
        <Heading size="lg">Maintenance Logs</Heading>
      </Flex>
      <DataTable
        isReset={isReset}
        setIsReset={setIsReset}
        refetch={refetch}
        setRefetch={setRefetch}
        filters={{
          ...filters,
          assignedTo: user?.role === ROLES_TYPES.TECH ? user?._id : null,
          reportedBy: user?.role === ROLES_TYPES.TENANT ? user?._id : null,
          search,
        }}
        filterComponent={filterComponent}
        columns={columns}
        source={fetchTicketLogs}
      />
      <RemovePopup
        setLoading={setRefetch}
        setIsRemove={setIsRemove}
        isRemove={isRemove}
        loading={refetch}
      />
      <UpdateTicketStatus
        setUpdateTicket={setUpdateTicket}
        updateTicket={updateTicket}
        loading={refetch}
        setLoading={setRefetch}
      />
    </Box>
  );
}

export default function Maintenance() {
  const { user } = useGlobalStore();
  if (user?.role === "landlord") return <UnauthorizedPage />;

  return <MaintenanceLogs />;
}
