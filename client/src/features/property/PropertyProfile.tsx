"use client";
import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Grid,
  Image,
} from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { GridItemsList, items } from "./PropertyPage";
import { MdApartment } from "react-icons/md";
import GroupedAvatars from "@/components/GroupedAvatars";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyDetails } from "@/lib/api/property";
import { toaster } from "@/components/ui/toaster";
import { IProperty } from "@/types/property.types";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { Loading } from "@/components/Loading";
import RecentyAdded from "./components/RecentyAdded";
import PropertyForm from "./components/PropertyForm";
import MaintenanceStatus from "@/components/Status";

const PropertyProfile = () => {
  const params = useParams();
  const { setLoadingSpinner, loadingSpiner } = useGlobalStore();
  const [trigger, setTrigger] = useState(true);
  const [details, setDetails] = useState<IProperty | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  useEffect(() => {
    if (trigger) {
      (async () => {
        setLoadingSpinner(true);
        if (params?.propertyId) {
          const response = await getPropertyDetails(
            params.propertyId as string
          );
          if (response.error) {
            toaster.create({
              description:
                response.error?.msg || "Error fetching property details!",
              type: "error",
            });
          } else {
            setDetails(response?.property);
            const images = response?.property?.images || [];
            if (images.length > 0) {
              setSelectedImage(images[0]?.path);
            }
          }
        }
        setTrigger((prev) => !prev);
        setLoadingSpinner(false);
      })();
    }
  }, [params, trigger]);

  if (loadingSpiner) return <Loading />;
  return (
    <Box mx="auto">
      <Flex justifyContent={"space-between"} alignItems="center" my={8}>
        <Heading size="lg" mb={6}>
          Property Profile
        </Heading>
        <PropertyForm
          setTrigger={setTrigger}
          details={details}
          type="update"
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
        />
      </Flex>

      <Flex gap={8} flexWrap="wrap">
        {/* Left: Main Image & Thumbnails */}
        <Box flex="1" minW="300px">
          <Image
            borderRadius={"md"}
            src={selectedImage || "https://placehold.co/400"}
            height={400}
            width={"100%"}
            alt=""
          />
          <HStack gap={3} mt={5} overflowX="auto">
            {details?.images?.map((image, index) => (
              <Image
                key={index}
                src={image.path}
                cursor="pointer"
                onClick={() => setSelectedImage(image?.path)}
                alt="Property Thumbnail"
                borderRadius={"md"}
                w="24"
                h="20"
              />
            ))}
          </HStack>
        </Box>

        {/* Right: Details */}
        <Box flex="1" minW="300px">
          <Heading size="xl" mb={1}>
            {details?.name}
          </Heading>
          <Flex alignItems={"center"} gap={2}>
            <FiMapPin color="#a1a1aa" />
            <Text color="gray.400">{details?.location.province}</Text>
          </Flex>

          <Box my={5}>
            <Heading size={"md"} mb={4}>
              Property Details
            </Heading>
            <div>
              <Text fontSize={14} fontWeight={500} color={"gray.600"} mb={4}>
                Description
              </Text>
              <Text fontSize="sm" color="gray.400" mb={4}>
                {details?.description || "No description available."}
              </Text>
            </div>
          </Box>

          <Grid templateColumns="repeat(2, 1fr)" gap="5" alignItems={"center"}>
            <GridItemsList
              label={"Rent"}
              type={
                <Text fontSize={14} color={"gray.400"}>
                  P {details?.rent} / unit
                </Text>
              }
            />
            <GridItemsList
              label={"Number of units"}
              type={
                <Text fontSize={14} color={"gray.400"}>
                  {details?.units}
                </Text>
              }
            />
            <GridItemsList
              label={"Type"}
              type={
                <Flex gap={2} alignItems={"start"}>
                  <MdApartment color="#a1a1aa" />
                  <Text fontSize={14} color={"gray.400"}>
                    {details?.type}
                  </Text>
                </Flex>
              }
            />
            <GridItemsList
              label={"Maintenance Status"}
              type={<MaintenanceStatus status={details?.status} />}
            />
            <GridItemsList
              label={"Tenants"}
              type={<GroupedAvatars items={items} />}
            />
          </Grid>
        </Box>
      </Flex>

      <RecentyAdded />
    </Box>
  );
};

export default PropertyProfile;
