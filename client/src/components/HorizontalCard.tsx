import { Link, Grid } from "@chakra-ui/react";
import { ReactNode } from "react";

const HorizontalCard = ({
  templateColumns,
  grids,
  route,
}: {
  templateColumns: number;
  grids: ReactNode;
  route: string;
}) => {
  return (
    <Link
      href={route}
      textDecoration="none"
      outline="none"
      bg={"white"}
      borderRadius={"md"}
      p={3}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Grid
        templateColumns={`repeat(${templateColumns}, 1fr)`}
        gap="5"
        alignItems={"center"}
      >
        {grids}
      </Grid>
    </Link>
  );
};
export default HorizontalCard;
