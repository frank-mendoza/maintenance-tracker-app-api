"use client";

import {
  Button,
  IconButton,
  Input,
  Dialog,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BiFilter, BiRefresh } from "react-icons/bi";

import "./DataFilter.css";
import { Tooltip } from "./ui/tooltip";

interface DataFilterProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  title: string;
  filters: any;
  filtersFields: ReactNode;
  onSubmitFilter: () => void;
  actions?: ReactNode;
  actionButtons?: ReactNode;
  onRefresh: () => void;
  setIsOpen: any;
}
const DataFilter = ({
  search,
  onSearchChange,
  isOpen,
  title,
  setIsOpen,
  filters,
  filtersFields,
  onSubmitFilter,
  actions,
  actionButtons,
  onRefresh,
}: DataFilterProps) => {
  const filterNumber = Object.values(filters).filter(
    (val) => typeof val === "string" && val.trim() !== ""
  ).length;
  return (
    <Stack
      direction={{ md: "row", base: "column" }}
      justify={actions ? "space-between" : "end"}
      align="center"
      mb={2}
    >
      <Input
        placeholder="Search..."
        value={search}
        p={4}
        onChange={onSearchChange}
        maxW={{ md: "400px", base: "100%" }}
      />
      <Flex wrap={"wrap"} gap={2} align="center">
        <Dialog.Root
          lazyMount
          closeOnInteractOutside={false}
          open={isOpen}
          placement={"center"}
          onOpenChange={(e) => setIsOpen(e.open)}
        >
          <Dialog.Trigger asChild>
            <IconButton
              aria-label="Filter"
              variant={"subtle"}
              className="filter"
            >
              {filterNumber !== undefined && filterNumber > 0 && (
                <div className="badge-alert">{filterNumber}</div>
              )}
              <BiFilter />
            </IconButton>
          </Dialog.Trigger>

          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content width={"400px"}>
              <Dialog.CloseTrigger />
              <Dialog.Header mb={4}>
                <Dialog.Title>Filter {title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body my={4} py={0}>
                <Stack gap={4}>{filtersFields}</Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Stack direction="row" justify="flex-end">
                  <Button
                    px={4}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    variant="ghost"
                  >
                    Close
                  </Button>
                  <Button px={4} colorScheme="blue" onClick={onSubmitFilter}>
                    Apply
                  </Button>
                </Stack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
        {actionButtons && actionButtons}
        <Tooltip showArrow content="Reset filters">
          <IconButton
            onClick={onRefresh}
            variant="subtle"
            colorPalette="red"
            aria-label="Call support"
          >
            <BiRefresh size={60} />
          </IconButton>
        </Tooltip>
        {actions && actions}
      </Flex>
    </Stack>
  );
};
export default DataFilter;
