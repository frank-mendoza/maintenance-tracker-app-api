"use client";
import { Box, Flex, Heading, Text, HStack, Image } from "@chakra-ui/react";
import { FiMapPin } from "react-icons/fi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyDetails } from "@/lib/api/property";
import { toaster } from "@/components/ui/toaster";
import { IProperty } from "@/types/property.types";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { Loading } from "@/components/Loading";
import moment from "moment";
import MaintenanceStatus from "@/components/Status";

const PropertyProfile = () => {
  const params = useParams();
  const { setLoadingSpinner, loadingSpiner } = useGlobalStore();
  const [trigger, setTrigger] = useState(true);
  const [details, setDetails] = useState<IProperty | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [isOpenDialog, setIsOpenDialog] = useState(false);

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
  }, [params, setLoadingSpinner, trigger]);

  const detailsList = [
    {
      label: "Property Description",
      value: details?.description,
    },
    {
      label: "Property Type",
      value: details?.type,
    },
    {
      label: "Monthly Rate",
      value: `PHP` + " " + details?.units,
    },
    {
      label: "Date Created",
      value: moment(details?.createdAt).format("MMM D YYYY"),
    },
    {
      label: "Status",
      value: "",
    },
  ];

  if (loadingSpiner) return <Loading />;
  return (
    <Box mx="auto">
      <Flex justifyContent={"space-between"} alignItems="center" my={8}>
        <Heading size="lg" mb={6}>
          Property Profile
        </Heading>
        {/* <PropertyForm
          setTrigger={setTrigger}
          details={details}
          type="update"
          isOpenDialog={isOpenDialog}
          setIsOpenDialog={setIsOpenDialog}
        /> */}
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
                border="1px solid grey"
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
            <Text color="gray.400">
              {details?.location?.town}, {details?.location?.province}
            </Text>
          </Flex>

          {detailsList.map((detail, i) => (
            <Box key={i} my={3}>
              <Text fontSize={14} fontWeight={600} color={"gray.600"} mb={2}>
                {detail.label}
              </Text>
              {detail.label === "Status" ? (
                <MaintenanceStatus status={details?.status} />
              ) : (
                <Text fontSize="sm" color="gray.400">
                  {detail.value}
                </Text>
              )}
            </Box>
          ))}
        </Box>
      </Flex>

      {/* <RecentyAdded /> */}
    </Box>
  );
};

export default PropertyProfile;
