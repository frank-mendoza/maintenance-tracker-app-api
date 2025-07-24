import { USER_STATUS } from "@/constants/constants";
import { Badge } from "@chakra-ui/react";

const UserStatusbadge = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <Badge
      minW={"80px"}
      justifyContent={"center"}
      colorPalette={USER_STATUS[isVerified ? "Yes" : "No"].color}
    >
      {USER_STATUS[isVerified ? "Yes" : "No"].label}
    </Badge>
  );
};
export default UserStatusbadge;
