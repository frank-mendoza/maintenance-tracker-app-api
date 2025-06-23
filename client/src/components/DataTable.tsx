"use client";

import {
  ButtonGroup,
  IconButton,
  Stack,
  Table,
  createListCollection,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Pagination } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import SelectInput from "./Select";
import DataFilter from "./DataFilter";

type Column = {
  key: string;
  label: string;
  render?: (row: RowData) => React.ReactNode;
  sortable?: boolean; // Indicates if the column is sortable
};

type RowData = {
  [key: string]: string | number | ReactNode;
};

type DataTableProps = {
  columns: Column[];
  data: RowData[];
  actions?: ReactNode;
  title: string;
  searchKey: string;
};

const DataTable = ({
  columns,
  data,
  actions,
  title,
  searchKey,
}: DataTableProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({ property: "", status: "" });
  const [sortBy, setSortBy] = useState<string>(""); // e.g. "tenantName"
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const list = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  });

  const filteredData = data.filter((item) => {
    const matchSearch = searchKey
      ? (item[searchKey] ?? "")
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;

    const matchProperty = filters.property
      ? item.property === filters.property
      : true;

    const matchStatus = filters.status ? item.status === filters.status : true;

    return matchSearch && matchProperty && matchStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0; // no sorting

    const valA = a[sortBy]?.toString().toLowerCase();
    const valB = b[sortBy]?.toString().toLowerCase();

    if (valA === undefined || valB === undefined) return 0; // handle undefined values
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Stack width="full" gap="5">
      <DataFilter
        actions={actions}
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        isOpen={isOpen}
        onOpenFilter={(e) => setIsOpen(e.open)}
        title={title}
        filters={
          <>
            <SelectInput
              label={"Property"}
              // value={filters.property}
              // onChange={(e) =>
              //   setFilters((prev) => ({
              //     ...prev,
              //     property: e.target.value,
              //   }))
              // }
              placeholder="Select property"
              items={list}
            />
            <SelectInput
              label={"Status"}
              // value={filters.property}
              // onChange={(e) =>
              //   setFilters((prev) => ({
              //     ...prev,
              //     property: e.target.value,
              //   }))
              // }
              placeholder="Select status"
              items={list}
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
      <Table.ScrollArea borderWidth="1px" minW={"100%"}>
        <Table.Root
          stickyHeader
          size="sm"
          variant="outline"
          interactive
          borderRadius={"md"}
        >
          <Table.Row>
            {columns.map((col) => (
              <Table.ColumnHeader
                key={col.key}
                p={4}
                bg={"gray.100"}
                onClick={() => {
                  if (!col.sortable) return;
                  if (sortBy === col.key) {
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  } else {
                    setSortBy(col.key);
                    setSortOrder("asc");
                  }
                }}
                cursor={col.sortable ? "pointer" : "default"}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <> {sortOrder === "asc" ? "▲" : "▼"}</>
                )}
              </Table.ColumnHeader>
            ))}
          </Table.Row>

          <Table.Body>
            {sortedData.map((row, idx) => (
              <Table.Row key={idx}>
                {columns.map((col) => (
                  <Table.Cell key={col.key} p={4}>
                    {col.render ? col.render(row) : row[col.key]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Optional Pagination: Replace with actual logic if needed */}
      <Pagination.Root count={data.length} pageSize={5} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton key={page.value}>{page.value}</IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
};

export default DataTable;
