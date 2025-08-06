import { TICKET_STATUS_PROPS } from "@/lib/helper/validationStatusChange";
import { MaintenanceLog } from "@/types/maintenance.types";
import { Badge } from "@chakra-ui/react";

const TicketStatusBadge = ({
  status,
}: {
  status: MaintenanceLog["status"];
}) => {
  return (
    <Badge
      minW={"80px"}
      justifyContent={"center"}
      colorPalette={
        TICKET_STATUS_PROPS[
          status?.toUpperCase() as keyof typeof TICKET_STATUS_PROPS
        ]?.color
      }
    >
      {
        TICKET_STATUS_PROPS[
          status?.toUpperCase() as keyof typeof TICKET_STATUS_PROPS
        ].label
      }
    </Badge>
  );
};
export default TicketStatusBadge;
