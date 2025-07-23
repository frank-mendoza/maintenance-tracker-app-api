import { User } from "@/types/user.type";
import { Avatar } from "@chakra-ui/react";

const ProfileAvatar = ({ user, lg }: { user: User | null; lg?: boolean }) => {
  return (
    <Avatar.Root boxSize={lg ? "32" : "12"} colorPalette="gray">
      <Avatar.Fallback />
      <Avatar.Image
        src={
          user?.images && user?.images.length > 0
            ? user?.images[0]?.path
            : "https://bit.ly/broken-link"
        }
      />
    </Avatar.Root>
  );
};
export default ProfileAvatar;
