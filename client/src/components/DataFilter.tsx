/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { BiFilter } from "react-icons/bi";

interface DataFilterProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
  onOpenFilter: (e: any) => void;
  title: string;
  filters: ReactNode;
  onCLoseFilter: () => void;
  onSubmitFilter: () => void;
  actions?: ReactNode;
  actionButtons?: ReactNode;
}
const DataFilter = ({
  search,
  onSearchChange,
  isOpen,
  onOpenFilter,
  title,
  filters,
  onCLoseFilter,
  onSubmitFilter,
  actions,
  actionButtons,
}: DataFilterProps) => {
  return (
    <Stack
      direction="row"
      justify={actions ? "space-between" : "end"}
      align="center"
      mb={2}
    >
      <Flex gap={2} align="center">
        <Input
          placeholder="Search..."
          value={search}
          p={4}
          onChange={onSearchChange}
          maxW="400px"
        />
        <Dialog.Root
          lazyMount
          open={isOpen}
          placement={"center"}
          onOpenChange={onOpenFilter}
        >
          <Dialog.Trigger asChild>
            <IconButton aria-label="Filter" variant={"subtle"}>
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
                <Stack gap={4}>{filters}</Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Stack direction="row" justify="flex-end">
                  <Button px={4} onClick={onCLoseFilter} variant="ghost">
                    Reset
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
      </Flex>
      {actions && actions}
    </Stack>
  );
};
export default DataFilter;
