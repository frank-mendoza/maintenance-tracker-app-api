"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import DataTable from "@/components/DataTable";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { BiPencil, BiPlus, BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";

export default function TenantsPage() {
  const columns = [
    { key: "tenantName", label: "Tenant Name", sortable: true },
    { key: "property", label: "Property" },
    { key: "status", label: "Status" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "dateStarted", label: "Date Started" },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <>
          <IconButton
            variant="ghost"
            aria-label="Edit"
            onClick={() => console.log("Edit", row)}
          >
            <BiPencil />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="View"
            onClick={() => console.log("View", row)}
          >
            <FaEye />{" "}
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Delete"
            onClick={() => console.log("Delete", row)}
          >
            <BiTrash color="red" />
          </IconButton>
        </>
      ),
    },
  ];

  const data = [
    {
      tenantName: "John Doe",
      property: "Sunset Villas",
      status: "Active",
      email: "john@example.com",
      phone: "123-456-7890",
      dateStarted: "2023-01-15",
    },
    {
      tenantName: "Jane Smith",
      property: "Green Heights",
      status: "Active",
      email: "jane@example.com",
      phone: "321-654-0987",
      dateStarted: "2023-02-20",
    },
  ];

  return (
    <Box px={0} py={8}>
      <Flex gap={2} alignItems="center" mb={4}>
        <Heading size="lg">Tenants</Heading>
      </Flex>
      <DataTable
        searchKey="tenantName"
        title="Tenants"
        columns={columns}
        data={data}
        actions={
          <Button px={4}>
            <BiPlus /> Add tenants
          </Button>
        }
      />
    </Box>
  );
}
