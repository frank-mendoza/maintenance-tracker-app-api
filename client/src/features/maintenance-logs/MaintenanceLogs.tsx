"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import DataTable from "@/components/DataTable";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";

export default function MaintenanceLogs() {
  const columns = [
    { key: "propertyId", label: "ID", sortable: true },
    { key: "propertyName", label: "Property Name", sortable: true },
    { key: "title", label: "Property" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "reportedBy", label: "Reported By" },
    { key: "createdAt", label: "Date Created" },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <>
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
      propertyId: "1",
      propertyName: "Viracc",
      title: "Sunset Villas",
      description: "No water supply",
      status: "pending",
      reportedBy: "John Doe",
      createdAt: "2023-01-15",
    },
    {
      propertyId: "2",
      propertyName: "CDHI",
      title: "Sunset Villas",
      description: "No television",
      status: "pending",
      reportedBy: "John Doe",
      createdAt: "2023-01-15",
    },
  ];

  return (
    <Box px={6} py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Maintenance Logs</Heading>
      </Flex>
      <DataTable
        title="Maintenance Logs"
        searchKey={"propertyName"}
        columns={columns}
        data={data}
      />
    </Box>
  );
}
