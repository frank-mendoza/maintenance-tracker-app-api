import { PROPERTY_STATUS } from "@/constants/constants";
import { MaintenanceLog } from "@/types/maintenance.types";
import { IProperty } from "@/types/property.types";
import { Badge } from "@chakra-ui/react";

type PropertyStatusKey = keyof typeof PROPERTY_STATUS;

const PropertyStatusBadge = ({
  item,
}: {
  item: (IProperty | MaintenanceLog) & { status: PropertyStatusKey };
}) => {
  return (
    <Badge
      minW={"80px"}
      justifyContent={"center"}
      colorPalette={
        item.status && PROPERTY_STATUS[item.status]?.color
          ? PROPERTY_STATUS[item.status].color
          : "gray"
      }
    >
      {item.status && PROPERTY_STATUS[item.status]?.label
        ? PROPERTY_STATUS[item.status].label
        : "Unknown"}
    </Badge>
  );
};
export default PropertyStatusBadge;
