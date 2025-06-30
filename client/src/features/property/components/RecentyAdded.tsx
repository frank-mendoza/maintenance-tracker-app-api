import { toaster } from "@/components/ui/toaster";
import { fetchProperties } from "@/lib/api/property";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Loading } from "@/components/Loading";
import { IProperty } from "@/types/property.types";

const RecentyAdded = () => {
  const { loadingSpiner } = useGlobalStore();
  const [items, setItems] = useState<IProperty[]>([]);

  const fetchUsers = useCallback(async () => {
    const query: any = { sort: "newest", limit: 4 };

    const res: any = await fetchProperties(query);

    if (res.error) {
      toaster.create({
        description: res?.msg || "Error fetching data!",
        type: "error",
      });
    } else {
      setItems(res?.properties || []);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loadingSpiner) return <Loading />;
  if (!items || items.length === 0) return null;
  return (
    <Box mt={10} mb={4}>
      <Heading size={"md"} mb={2}>
        Recently Added
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {items.map((property) => (
          <PropertyCard key={property._id} data={property} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
export default RecentyAdded;
