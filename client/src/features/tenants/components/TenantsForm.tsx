import DialogPopup from "@/components/CustomDialog";
import Inputs from "@/components/inputs/Inputs";
import SelectInput from "@/components/Select";
import { toaster } from "@/components/ui/toaster";
import { ROLES } from "@/constants/constants";
import { userMutation } from "@/lib/api/user";
import { tenantSchema } from "@/lib/formValidator";
import { User } from "@/types/user.type";
import { Box, Button, createListCollection, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPlus } from "react-icons/bi";

// type TenantsFormData = {
//   name: string;
//   lastName: string;
//   role: string;
//   phone: string;
//   email: string;
//   status?: string;
// };

const TenantsForm = ({
  type,
  setTrigger,
  setIsOpenDialog,
  isOpenDialog,
  details,
  setUserDetails,
}: {
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
  isOpenDialog: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  details?: User | null;
  setUserDetails?: any;
}) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: details
      ? {
          name: details.name || "",
          lastName: details.lastName || "",
          phone: details.phone || "",
          email: details.email || "",
          role: details.role || "",
        }
      : {
          name: "",
          lastName: "",
          phone: "",
          email: "",
          role: "",
        },
    resolver: yupResolver(tenantSchema),
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (details) {
      setRoles([details.role]);
      setValue("name", details.name);
      setValue("email", details.email);
      setValue("lastName", details.lastName);
      setValue("phone", details.phone ? String(details.phone) : "");
    }
  }, [details, setValue]);

  useEffect(() => {
    clearErrors("role");
    let roleId: string;
    if (roles.length > 0) roleId = roles[0];
    else roleId = "";
    setValue("role", roleId);
  }, [clearErrors, roles, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const res: any = await userMutation({
      ...data,
      role: roles[0],
      isUpdate: type === "update",
      id: type === "update" ? (details?._id as string) : undefined, // Only include id for update
    });

    if (res?.success) {
      toaster.create({
        description: "Successfully created user!",
        type: "success",
      });
      setIsOpenDialog(false);
      setTrigger(true);
      reset();
      setUserDetails(null);
    } else {
      toaster.create({
        description: res?.msg || `Failed to ${type}. Please try again.`,
        type: "error",
      });
    }
    setLoading(false);
  };

  const roleList = createListCollection({
    items: ROLES,
  });

  const fields = [
    {
      label: "Name",
      placeholder: "Enter first name",
      id: "name",
    },
    {
      label: "Last Name",
      placeholder: "Enter last name",
      id: "lastName",
    },
    {
      label: "Phone Number",
      placeholder: "Enter phone number",
      id: "phone",
    },

    {
      label: "Email",
      placeholder: "Enter email",
      id: "email",
      type: "email",
      disabled: type === "update",
    },
  ];

  const statusInput = {
    label: "Status",
    placeholder: "",
    id: "status",
    type: "radio",
    value: details?.isVerified ? "1" : "2",
    items: [
      { label: "Verified", value: "1" },
      { label: "Unverified", value: "2" },
    ],
    disabled: true,
  };

  const formProps = {
    errors,
    register,
    clearErrors,
  };

  const form = (
    <>
      <VStack gap={4} alignItems={"start"}>
        {fields.map((field, idx) => (
          <Inputs key={idx} {...field} {...formProps} />
        ))}

        <Box width={"100%"}>
          <SelectInput
            width={"100%"}
            vertical
            items={roleList}
            placeholder={"Select role"}
            label={"Role"}
            value={roles}
            id="role"
            errors={errors}
            onChange={(e: any) => setRoles(e.value)}
          />
        </Box>
        {type === "update" && <Inputs {...statusInput} {...formProps} />}
      </VStack>
    </>
  );

  return (
    <>
      <Button p={4} onClick={() => setIsOpenDialog(true)}>
        <BiPlus /> Add tenant
      </Button>
      <DialogPopup
        size={"sm"}
        onSubmit={handleSubmit((data) => onSubmit(data))}
        onOpenChange={(e) => setIsOpenDialog(e.open)}
        open={isOpenDialog}
        loading={loading}
        content={form}
        title={
          type === "create"
            ? "Add tenant"
            : `Update ${details?.name + " " + details?.lastName}`
        }
        onClose={() => {
          setIsOpenDialog(false);
          reset();
          clearErrors();
          setUserDetails(null);
        }}
      />
    </>
  );
};
export default TenantsForm;
