import { MAINTENANCE_STATUS } from "@/lib/constants/constants";
import { IProperty } from "@/types/property.types";
import { Flex, Text } from "@chakra-ui/react";
import { GoDotFill } from "react-icons/go";

const MaintenanceStatus = ({ status }: { status: IProperty["status"] }) => {
  if (status === undefined || !MAINTENANCE_STATUS[status]) {
    return null;
  }
  return (
    <Flex gap={2} alignItems={"center"}>
      <GoDotFill size={24} color={MAINTENANCE_STATUS[status].color} />
      <Text fontSize={12} color={MAINTENANCE_STATUS[status].color}>
        {MAINTENANCE_STATUS[status].label}
      </Text>
    </Flex>
  );
};
export default MaintenanceStatus;
