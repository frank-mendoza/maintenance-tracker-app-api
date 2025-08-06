import DialogPopup from "@/components/CustomDialog";
import UploadFile from "@/components/FileUpload";
import Inputs from "@/components/inputs/Inputs";
import SelectInput from "@/components/Select";
import { toaster } from "@/components/ui/toaster";
import { propertyMutation } from "@/lib/api/property";
import { propertySchema } from "@/lib/formValidator";
import { loadImageFiles } from "@/lib/helper/helper";
import { IProperty } from "@/types/property.types";
import {
  Button,
  createListCollection,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { FaPen } from "react-icons/fa";

type PropertyFormData = {
  name: string;
  description: string;
  town: string;
  province: string;
  rent: number;
};

const PropertyForm = ({
  type,
  setTrigger,
  setIsOpenDialog,
  isOpenDialog,
  details,
}: {
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
  isOpenDialog: boolean;
  setTrigger: any;
  type: "create" | "update";
  details?: IProperty | null; // Optional for create, required for update
}) => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    clearErrors,
    // setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: details
      ? {
          name: details.name || "",
          description: details.description || "",
          town: details.location?.town || "",
          province: details.location?.province || "",
          rent: details.rent || 0,
        }
      : {
          name: "",
          description: "",
          town: "",
          province: "",
          rent: 0,
        },
    resolver: yupResolver(propertySchema),
  });
  const [images, setImages] = useState<File[]>([]);
  const [units, setUnits] = useState<number[]>([]);
  const [unitType, setUnitType] = useState<
    ("apartment" | "house" | "boarding house" | "condo")[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details) {
      setUnits([details?.units || 1]);
      setUnitType([details?.type || "apartment"]);
      // If you want to display existing image URLs, you may need to handle them separately from File[]
      // For now, clear images state or handle conversion if needed
      // setImages([]);
    }
  }, [details]);

  useEffect(() => {
    if (
      type === "update" &&
      isOpenDialog &&
      details?.images?.length &&
      images.length === 0
    ) {
      (async () => {
        const loadedImgs = await loadImageFiles(details.images, images);
        setImages(loadedImgs);
      })();
    }
  }, [type, isOpenDialog, details?.images, images]);

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    // setLoadingSpinner(true);
    const res: any = await propertyMutation({
      ...data,
      units: units[0],
      type: unitType[0],
      images,
      isUpdate: type === "update",
      id: type === "update" ? (params.propertyId as string) : undefined, // Only include id for update
    });

    if (res?.success) {
      toaster.create({
        description:
          type === "update" ? "Successfully updated!" : "Successfully created!",
        type: "success",
      });
      setIsOpenDialog(false);
      setTrigger(true);
      reset();
    } else {
      toaster.create({
        description: res?.msg || `Failed to ${type}. Please try again.`,
        type: "error",
      });
    }

    setLoading(false);
  };

  const unitsList = createListCollection({
    items: [
      { label: "1 unit", value: 1 },
      { label: "2 units", value: 2 },
      { label: "3 units", value: 3 },
      { label: "4 units", value: 4 },
    ],
  });

  const types = createListCollection({
    items: [
      { label: "Apartment", value: "apartment" },
      { label: "House", value: "house" },
      { label: "Boarding house", value: "boarding house" },
      { label: "Condo", value: "condo" },
    ],
  });

  const form = (
    <>
      <VStack gap={4} alignItems={"start"}>
        <SimpleGrid width={"100%"} columns={2} minChildWidth="sm" gap="40px">
          <Inputs
            label="Name"
            placeholder="Enter property name"
            id="name"
            errors={errors}
            register={register}
          />

          <Inputs
            label="Town/City"
            placeholder="Enter property city address"
            id="town"
            errors={errors}
            register={register}
          />

          <Inputs
            label="Province"
            placeholder="Enter property province address"
            id="province"
            errors={errors}
            register={register}
          />

          <SelectInput
            width={"100%"}
            vertical
            items={unitsList}
            placeholder={"Enter units"}
            label={"Number of units"}
            // errors={errors}
            value={units}
            onChange={(e: any) => setUnits(e.value)}
          />
          <SelectInput
            width={"100%"}
            vertical
            items={types}
            // errors={errors}
            placeholder={"Enter aprtment types"}
            label={"Apartment Type"}
            value={unitType}
            onChange={(e: any) => setUnitType(e.value)}
          />
          <Inputs
            label="Monthly Rent"
            placeholder="Enter monthly rent"
            id="rent"
            errors={errors}
            type={"number"}
            register={register}
          />
        </SimpleGrid>
        <Inputs
          type={"textarea"}
          label="Description"
          placeholder="Enter property description"
          id="description"
          errors={errors}
          register={register}
        />

        <UploadFile type={type} images={images} setImages={setImages} />
      </VStack>
    </>
  );

  return (
    <>
      <Button
        className="action-btn"
        p={4}
        onClick={() => setIsOpenDialog(true)}
      >
        {type === "create" ? (
          <>
            {" "}
            <BiPlus /> Add property
          </>
        ) : (
          <>
            <FaPen />
            Update property
          </>
        )}
      </Button>
      <DialogPopup
        onSubmit={handleSubmit((data) => onSubmit(data))}
        onOpenChange={(e) => setIsOpenDialog(e.open)}
        open={isOpenDialog}
        loading={loading}
        content={form}
        title={type === "create" ? "Add property" : "Update property"}
        onClose={() => {
          setIsOpenDialog(false);
          reset();
          clearErrors();
        }}
      />
    </>
  );
};
export default PropertyForm;
