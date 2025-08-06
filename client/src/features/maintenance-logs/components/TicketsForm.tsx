/* eslint-disable @typescript-eslint/no-unused-vars */
import DialogPopup from "@/components/CustomDialog";
import UploadFile from "@/components/FileUpload";
import HoverImage from "@/components/Hover";
import Inputs from "@/components/inputs/Inputs";
import SelectInput from "@/components/Select";
import { toaster } from "@/components/ui/toaster";
import {
  PROPERTY_STATUS,
  ROLES_TYPES,
  USER_STATUS,
} from "@/lib/constants/constants";
import { maintenanceMutation } from "@/lib/api/maintenance";
import { fetchProperties } from "@/lib/api/property";
import { fetchUsers } from "@/lib/api/user";
import { ticketSchema } from "@/lib/formValidator";
import { loadImageFiles } from "@/lib/helper/helper";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { MaintenanceLog } from "@/types/maintenance.types";
import { IProperty } from "@/types/property.types";
import { User } from "@/types/user.type";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import TicketStatusBadge from "./TicketStatusbadge";

type TicketData = {
  propertyId: string;
  title: string;
  description: string;
  assignedTo: string;
};

const TicketsForm = ({
  type,
  setTrigger,
  setIsOpenDialog,
  isOpenDialog,
  details,
  setDetails,
}: {
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
  isOpenDialog: boolean;
  setTrigger: any;
  setDetails: any;
  type: "create" | "update";
  details?: MaintenanceLog | null; // Optional for create, required for update
}) => {
  const { user } = useGlobalStore();

  const isTenant = user?.role === ROLES_TYPES.TENANT;
  const isLandlord = user?.role === ROLES_TYPES.LANDLORD;
  const isPending = details?.status === PROPERTY_STATUS.pending.value;

  const isDisabled = isLandlord || (!isPending && type === "update");
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TicketData>({
    defaultValues: {
      propertyId: "",
      description: "",
      title: "",
      assignedTo: "",
    },
    resolver: yupResolver(ticketSchema),
  });
  const [images, setImages] = useState<File[]>([]);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [property, setProperty] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details && isOpenDialog) {
      setAssignee([details.assignedTo._id]);
      setProperty([details.property._id as string]);
      setValue("propertyId", details?.property?._id as string);
      setValue("description", details.description);
      setValue("title", details.title);
      setValue("assignedTo", details.assignedTo._id as string);

      (async () => {
        const loadedImgs = await loadImageFiles(details.images, images);
        setImages(loadedImgs);
      })();
    }
    if (!isOpenDialog) {
      setImages([]);
      setAssignee([]);
      setProperty([]);
    }
  }, [details, setValue, isOpenDialog]);

  useEffect(() => {
    if (assignee.length > 0) {
      clearErrors(["assignedTo"]);
      setValue("assignedTo", assignee[0] || "");
    }
    if (property.length > 0) {
      clearErrors(["propertyId"]);
      setValue("propertyId", property[0] || "");
    }
  }, [assignee, property, setValue, clearErrors]);

  useEffect(() => {
    if (isOpenDialog) {
      (async () => {
        try {
          const [users, properties] = await Promise.all([
            fetchUsers({ status: USER_STATUS.Yes, role: ROLES_TYPES.TECH }),
            fetchProperties({}),
          ]);

          setUsers(users.data || []);
          setProperties(properties.data || []);
        } catch (error) {
          toaster.create({
            description: "Failed to fetch data",
            type: "error",
          });
        }
      })();
    }
  }, [isOpenDialog]);

  const onSubmit = async (data: TicketData) => {
    setLoading(true);
    const res: any = await maintenanceMutation({
      ...data,
      reportedBy: user?._id as string,
      isUpdate: type === "update",
      id: details?._id,
      images,
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

  const usersList = createListCollection({
    items: users.map((obj) => ({
      label: `${obj.name} (${obj.lastName})`,
      value: obj._id,
    })),
  });

  const propertyList = createListCollection({
    items: properties.map((obj) => ({
      label: obj.name,
      value: obj._id,
    })),
  });

  const form = (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Inputs
          label="Issue Name"
          placeholder="Enter ticket name"
          id="title"
          errors={errors}
          register={register}
          disabled={isDisabled}
        />
        <Inputs
          type={"textarea"}
          label="Issue Description"
          placeholder="Enter ticket description"
          id="description"
          errors={errors}
          register={register}
          disabled={isDisabled}
        />

        <SelectInput
          width={"100%"}
          vertical
          items={usersList}
          placeholder={"Select assignee"}
          label={"Assignee"}
          errors={errors}
          value={assignee}
          id="assignedTo"
          disabled={isDisabled}
          onChange={(e: any) => setAssignee(e.value)}
        />
        <SelectInput
          width={"100%"}
          vertical
          items={propertyList}
          placeholder={"Select property"}
          label={"Property"}
          errors={errors}
          id="propertyId"
          value={property}
          disabled={isDisabled}
          onChange={(e: any) => setProperty(e.value)}
        />
        {(isPending || type === "create") && (
          <Box width={"100%"}>
            <Text mb={2}>Proof / Actual Photo(s)</Text>
            <UploadFile
              disabled={isDisabled}
              dropzone
              type={type}
              size={150}
              images={images}
              setImages={setImages}
            />
          </Box>
        )}
        {!isPending && details?.images && details?.images.length > 0 && (
          <Box mb={4}>
            <Text mb={2}>Proof / Actual Photo(s) </Text>
            <Flex gap={4}>
              {details.images?.map((img) => (
                <HoverImage key={img.path} link={img.path} />
              ))}
            </Flex>
          </Box>
        )}
      </VStack>
    </>
  );

  const renderFormTitle = () => {
    let title: any = "Report issue";
    if (type === "update")
      title = (
        <>
          {isLandlord || !isPending ? "" : "Update"} {details?.title}
          {"    "}
          {details && <TicketStatusBadge status={details.status} />}
        </>
      );
    return title;
  };

  return (
    <>
      {isTenant && (
        <Button
          className="action-btn"
          p={4}
          onClick={() => setIsOpenDialog(true)}
        >
          <BiPlus /> Report issue
        </Button>
      )}

      <DialogPopup
        size={"md"}
        hideSaveBtn={(isLandlord || !isPending) && type === "update"}
        onSubmit={handleSubmit((data) => onSubmit(data))}
        onOpenChange={(e) => setIsOpenDialog(e.open)}
        open={isOpenDialog}
        loading={loading}
        content={form}
        title={renderFormTitle()}
        onClose={() => {
          setDetails(null);
          setIsOpenDialog(false);
          reset();
          clearErrors();
        }}
      />
    </>
  );
};
export default TicketsForm;
