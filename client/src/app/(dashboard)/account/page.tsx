"use client";

import Inputs from "@/components/inputs/Inputs";
import SelectInput from "@/components/Select";
import { ROLES } from "@/lib/constants/constants";
import useGlobalStore from "@/lib/store/useGlobalStore";
import {
  Box,
  Button,
  createListCollection,
  FileUpload,
  Flex,
  Float,
  SimpleGrid,
  Spinner,
  useFileUploadContext,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userMutation } from "@/lib/api/user";
import { toaster } from "@/components/ui/toaster";
import { urlToFile } from "@/lib/helper/helper";
import ProfileAvatar from "@/components/ProfileAvatar";
import { FaPen } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip";

type FormData = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  status?: string;
};

const Account = () => {
  const { user, setUser } = useGlobalStore();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormData>({
    // resolver: yupResolver(tenantSchema),
  });

  const [isResetImage, setIsResetImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const roleList = createListCollection({
    items: ROLES,
  });

  const formProps = {
    errors,
    register,
    clearErrors,
  };

  const loadFiles = useCallback(async () => {
    const files = await Promise.all(
      (user?.images ?? []).map(async (img) => urlToFile(img.path))
    );

    setImages(files);
  }, [user]);

  useEffect(() => {
    if (user) {
      setRoles([user.role]);
      reset({
        name: user?.name || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        role: user?.role || "",
        status: user?.isVerified ? "Verified" : "Unverified",
      });

      if (user?.images && user?.images.length > 0) {
        loadFiles();
      }
    }
  }, [user, reset, loadFiles]);

  useEffect(() => {
    clearErrors("role");
    let roleId: string;
    if (roles.length > 0) roleId = roles[0];
    else roleId = "";
    setValue("role", roleId);
  }, [clearErrors, roles, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (data.phone === "" || data.phone === null) {
      delete data.phone; // Remove phone if it's empty or null
    }

    const res: any = await userMutation({
      ...data,
      isUpdate: true,
      images,
      id: user?._id as string,
    });

    if (res?.success) {
      toaster.create({
        description: "Successfully updated your account",
        type: "success",
      });
      reset();
      setUser(res.user);
    } else {
      toaster.create({
        description: res?.msg || `Failed to update account`,
        type: "error",
      });
    }
    setLoading(false);
  };

  const fields = [
    {
      label: "Name",
      placeholder: "Enter first name",
      id: "name",
      disabled: isSubmitting,
    },
    {
      label: "Last Name",
      placeholder: "Enter last name",
      id: "lastName",
      disabled: isSubmitting,
    },
    {
      label: "Phone Number",
      placeholder: "Enter phone number",
      id: "phone",
      disabled: isSubmitting,
    },

    {
      label: "Email",
      placeholder: "Enter email",
      id: "email",
      type: "email",
      disabled: true,
    },
    {
      label: "Status",
      placeholder: "Account status",
      id: "status",
      disabled: true,
    },
  ];

  const selectFields = [
    {
      items: roleList,
      placeholder: "Select role",
      label: "Role",
      value: roles,
      disabled: isSubmitting,
      id: "role",
      onChange: (e: any) => {
        setRoles(e.value);
        setLoading(true);
      },
    },
  ];

  const FileUploadList = () => {
    const fileUpload = useFileUploadContext();
    const files = fileUpload.acceptedFiles;

    useEffect(() => {
      if (isResetImage) {
        fileUpload.clearFiles();
        setIsResetImage(false);
      }
    }, [fileUpload]);

    if (files.length === 0) return <ProfileAvatar lg user={user} />;
    return (
      <FileUpload.ItemGroup width={"auto"}>
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="32"
            p="0"
            borderRadius={"50%"}
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage
              borderRadius={"50%"}
              height={"100%"}
              objectFit={"cover"}
            />
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
    );
  };

  const handleFileChange = (newFiles: File[]) => {
    if (!isResetImage) {
      setLoading(true);
    }
    setImages(newFiles);
  };

  return (
    <Box px={0} pt={8} pb={10}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        {/* <Flex
          gap={2}
          alignItems="center"
          justifyContent={"space-between"}
          mb={4}
        >
          <Heading size="lg">Account Information</Heading>
        </Flex> */}

        <Box padding={"24px"} backgroundColor={"white"}>
          <FileUpload.Root
            w="auto"
            boxSize="32"
            position={"relative"}
            my={8}
            flexDirection={"column-reverse"}
            justifyContent={"center"}
            alignItems={"center"}
            marginX={"auto"}
            accept={["image/png", "image/jpeg", "image/jpg"]}
            maxFiles={1}
            onFileChange={(e) => handleFileChange(e.acceptedFiles)}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
              <Float cursor={"pointer"} offset={"2"}>
                <Tooltip showArrow content="Change profile picture">
                  <FaPen />
                </Tooltip>
              </Float>
              {/* <Button disabled={isSubmitting} variant="outline" size="sm">
                <HiUpload /> Upload picture
              </Button> */}
            </FileUpload.Trigger>
            <FileUploadList />
          </FileUpload.Root>

          <SimpleGrid
            width="100%"
            transition={"all ease-in-out"}
            columns={{ base: 3, xl: 4, lg: 3, md: 2, sm: 1 }}
            gap={6}
          >
            {fields.map((field, idx) => (
              <Inputs key={idx} {...field} {...formProps} />
            ))}

            {selectFields.map((slct, idx) => (
              <Box width={"100%"} key={idx}>
                <SelectInput
                  width={"100%"}
                  vertical
                  {...slct}
                  errors={errors}
                />
              </Box>
            ))}
          </SimpleGrid>

          <Flex justifyContent={"flex-end"} gap={"2"} mt={5}>
            <Button
              size={"sm"}
              colorPalette={"red"}
              onClick={async () => {
                reset();
                setRoles([user?.role as string]);
                setIsResetImage(true);
                setLoading(false);
              }}
              disabled={!isDirty && !loading}
            >
              Clear
            </Button>
            <Button
              minW={100}
              size={"sm"}
              type="submit"
              disabled={!isDirty && !loading}
            >
              {isSubmitting ? <Spinner /> : "Update"}
            </Button>
          </Flex>
        </Box>
      </form>
    </Box>
  );
};
export default Account;
