import { PROPERTY_STATUS } from "@/constants/constants";
import { IProperty } from "@/types/property.types";
import { Badge } from "@chakra-ui/react";

type PropertyStatusKey = keyof typeof PROPERTY_STATUS;

const PropertyStatusBadge = ({
  item,
}: {
  item: IProperty & { status: PropertyStatusKey };
}) => {
  return (
    <Badge
      minW={"80px"}
      justifyContent={"center"}
      colorPalette={PROPERTY_STATUS[item.status].color}
    >
      {PROPERTY_STATUS[item.status].label}
    </Badge>
  );
};
export default PropertyStatusBadge;
