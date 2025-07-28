/* eslint-disable @typescript-eslint/no-unused-vars */
import DialogPopup from "@/components/CustomDialog";
import Inputs from "@/components/inputs/Inputs";
import SelectInput from "@/components/Select";
import { toaster } from "@/components/ui/toaster";
import { ROLES_TYPES, USER_STATUS } from "@/constants/constants";
import PropertyStatusBadge from "@/features/property/components/PropertyStatusbadge";
import { maintenanceMutation } from "@/lib/api/maintenance";
import { fetchProperties } from "@/lib/api/property";
import { fetchUsers } from "@/lib/api/user";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { MaintenanceLog } from "@/types/maintenance.types";
import { IProperty } from "@/types/property.types";
import { User } from "@/types/user.type";
import { Button, createListCollection, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";

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
  const params = useParams();

  const isTenant = user?.role === ROLES_TYPES.TENANT;
  const isTechnician = user?.role === ROLES_TYPES.TECH;
  const isPending =
    details?.status === "pending" && user?.role === ROLES_TYPES.TENANT;
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
    // resolver: yupResolver(propertySchema),
  });
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignee, setAssignee] = useState<string[]>([]);
  const [property, setProperty] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details) {
      setAssignee([details.assignedTo._id]);
      setProperty([details.property._id as string]);
      setValue("propertyId", details?.property?._id as string);
      setValue("description", details.description);
      setValue("title", details.title);
      setValue("assignedTo", details.assignedTo._id as string);
    }
  }, [details, setValue]);

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
      propertyId: property[0],
      assignedTo: assignee[0],
      reportedBy: user?._id as string,
      isUpdate: type === "update",
      id: details?._id,
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

  const disabled = (isTechnician || !isPending) && type === "update";

  const form = (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Inputs
          label="Issue Name"
          placeholder="Enter ticket name"
          id="title"
          errors={errors}
          register={register}
          disabled={disabled}
        />
        <Inputs
          type={"textarea"}
          label="Issue Description"
          placeholder="Enter ticket description"
          id="description"
          errors={errors}
          register={register}
          disabled={disabled}
        />

        <SelectInput
          width={"100%"}
          vertical
          items={usersList}
          placeholder={"Select assignee"}
          label={"Assignee"}
          errors={errors}
          value={assignee}
          disabled={disabled}
          onChange={(e: any) => setAssignee(e.value)}
        />
        <SelectInput
          width={"100%"}
          vertical
          items={propertyList}
          placeholder={"Select property"}
          label={"Property"}
          errors={errors}
          value={property}
          disabled={disabled}
          onChange={(e: any) => setProperty(e.value)}
        />
      </VStack>
    </>
  );

  const renderFormTitle = () => {
    let title: any = "Report issue";
    if (type === "update")
      title = (
        <>
          Update {details?.title}
          {"    "}
          {details && <PropertyStatusBadge item={details} />}
        </>
      );
    return title;
  };

  return (
    <>
      {isTenant && (
        <Button p={4} onClick={() => setIsOpenDialog(true)}>
          <BiPlus /> Report issue
        </Button>
      )}
      <DialogPopup
        size={"md"}
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
