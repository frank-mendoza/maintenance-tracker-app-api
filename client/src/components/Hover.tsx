import { HoverCard, Image, Portal } from "@chakra-ui/react";

const HoverImage = ({ link }: { link: string }) => {
  return (
    <HoverCard.Root size="sm">
      <HoverCard.Trigger asChild>
        <Image
          cursor={"pointer"}
          rounded="md"
          width={100}
          height={100}
          src={link}
          alt={""}
        />
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content p={0} maxW={300}>
            <Image rounded={"md"} src={link} alt="" />
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
};

export default HoverImage;
