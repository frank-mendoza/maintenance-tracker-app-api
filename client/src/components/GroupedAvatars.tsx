/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarGroup } from "@chakra-ui/react";

const GroupedAvatars = ({ items }: { items: any[] }) => {
  return (
    <AvatarGroup size="xs" stacking="last-on-top">
      {items.map((item: any) => (
        <Avatar.Root width={"20px"} height={"20px"} key={item?.name}>
          <Avatar.Fallback name={item?.name} />
          <Avatar.Image src={item?.src} />
        </Avatar.Root>
      ))}
      <Avatar.Root width={"20px"} height={"20px"}>
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root>
    </AvatarGroup>
  );
};
export default GroupedAvatars;
