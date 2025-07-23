"use client";

import {
  ButtonGroup,
  Center,
  createListCollection,
  Flex,
  IconButton,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Pagination } from "@chakra-ui/react";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { toaster } from "./ui/toaster";
import SelectInput from "./Select";
import { User } from "@/types/user.type";

type Column = {
  key: string;
  label: string;
  render?: (row: User) => React.ReactNode;
  sortable?: boolean; // Indicates if the column is sortable
};

// RowData type is no longer needed since we use IUser directly

type DataTableProps = {
  columns: Column[];
  filterComponent?: ReactNode;
  source: any;
  filters: any;
  refetch: boolean;
  isReset?: boolean;
  setRefetch: any;
  setIsReset?: any;
};

const DataTable = ({
  filterComponent,
  columns,
  source,
  filters,
  refetch,
  setRefetch,
  isReset,
  setIsReset,
}: DataTableProps) => {
  const [data, setData] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<string>(""); // e.g. "tenantName"
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>("asc");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(refetch || true);
  const [numOfPages, setNumOfPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(["10"]);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters?.search);
      setLoading(true);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler); // Cleanup on input change
  }, [filters?.search]);

  const renderSort = useCallback(() => {
    if (isReset) return null;
    if (sortOrder === "asc") return "a-z";
    return "z-a";
  }, [isReset, sortOrder]);

  useEffect(() => {
    if (isReset) {
      setSortOrder(null);
      setSortBy("");
    }
  }, [isReset]);

  useEffect(() => {
    if (refetch || loading) {
      (async () => {
        setLoading(true);

        const query: any = {
          ...filters,
          sort: renderSort(),
          page: numOfPages,
          limit: Number(pageSize[0]),
        };

        if (debouncedSearch) query.search = debouncedSearch;
        const filtereQuery = Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(query).filter(([_, value]) => value !== null)
        );
        const res: any = await source(filtereQuery);

        if (res.error) {
          toaster.create({
            description: res?.msg || "Error fetching data!",
            type: "error",
          });
        } else {
          setData(res.data);
          setTotalItems(res.total || 0);
          setTotalPages(res.numOfPages);
        }
        setLoading(false);
        setRefetch(false);
        if (setIsReset) {
          setIsReset(false);
        }
      })();
    }
  }, [
    debouncedSearch,
    filters,
    source,
    refetch,
    loading,
    isReset,
    numOfPages,
    renderSort,
    setIsReset,
    setRefetch,
    pageSize,
  ]);

  const generateBooleanCell = (value: boolean) => {
    return value ? "Yes" : "No";
  };

  const renderTableList = () => {
    if (loading)
      return (
        <Table.Row>
          <td>
            <Center width={"100%"} py={5} mt={5}>
              <Spinner
                color="red.500"
                css={{ "--spinner-track-color": "colors.gray.200" }}
              />
              <Text color="colorPalette.600">Loading...</Text>
            </Center>
          </td>
        </Table.Row>
      );

    if (data.length === 0)
      return (
        <Table.Row>
          <td>
            <Center width={"100%"} py={5} mt={5}>
              <Text>No data available</Text>
            </Center>
          </td>
        </Table.Row>
      );
    return data.map((row, idx) => {
      return (
        <Table.Row key={idx}>
          {columns.map((col) => {
            const renderedValue =
              typeof (row as any)[col.key] === "boolean"
                ? generateBooleanCell((row as any)[col.key])
                : (row as any)[col.key];
            return (
              <Table.Cell key={col.key} p={4}>
                {col.render ? col.render(row) : renderedValue}
              </Table.Cell>
            );
          })}
        </Table.Row>
      );
    });
  };

  const items = createListCollection({
    items: [
      { label: "5", value: "5" },
      { label: "10", value: "10" },
      { label: "20", value: "20" },
      { label: "30", value: "30" },
    ],
  });

  console.log(totalPages);

  return (
    <Stack width="full" gap="5">
      {filterComponent || null}
      <Table.ScrollArea borderWidth="1px" minW={"100%"}>
        <Table.Root
          stickyHeader
          size="sm"
          variant="outline"
          interactive
          borderRadius={"md"}
        >
          <Table.Header>
            <tr>
              {columns.map((col) => (
                <Table.ColumnHeader
                  p={4}
                  key={col.key}
                  bg={"gray.100"}
                  onClick={() => {
                    if (!col.sortable) return;
                    setLoading(true);
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
            </tr>
          </Table.Header>

          <Table.Body>{renderTableList()}</Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <SelectInput
          width={110}
          vertical
          items={items}
          placeholder={""}
          label={`Total items: ${totalItems}`}
          value={pageSize}
          id="rows"
          // errors={errors}
          onChange={(e: any) => {
            setPageSize(e.value);
            // setNumOfPages(1);
            setLoading(true);
          }}
        />

        <Pagination.Root
          alignSelf={"end"}
          count={totalItems}
          pageSize={Number(pageSize[0])}
          page={numOfPages}
          onPageChange={(e) => {
            setNumOfPages(e.page);
            setLoading(true);
          }}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Flex>
    </Stack>
  );
};

export default DataTable;
