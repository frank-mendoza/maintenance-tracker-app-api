import { MaintenanceLog } from "@/types/maintenance.types";
import { Box, Flex, Text } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import TicketStatusBadge from "./TicketStatusbadge";

const TicketStatus = ({ ticket }: { ticket: MaintenanceLog }) => {
  return (
    <Flex my={4} justifyContent={"center"} alignItems={"center"} gap={10}>
      <Box mb={4}>
        <Text mb={2}>Current Status </Text>
        <TicketStatusBadge status={ticket.status} />
      </Box>
      <FaArrowRight />
      <Box mb={4}>
        <Text mb={2}>Next Status </Text>
        <TicketStatusBadge status={ticket?.nextStatus || "pending_approval"} />
      </Box>
    </Flex>
  );
};
export default TicketStatus;
