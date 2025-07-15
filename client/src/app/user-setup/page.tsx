"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Box,
  Button,
  VStack,
  Heading,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSetupschema } from "@/lib/formValidator";
import { InferType } from "yup";
import { toaster } from "@/components/ui/toaster";
import { useRouter, useSearchParams } from "next/navigation";
import Inputs from "@/components/inputs/Inputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { setupUser, verifyUserSetupToken } from "@/lib/api/auth";
import { IUser } from "@/types/user.type";
import { Loading } from "@/components/Loading";
import { BiError } from "react-icons/bi";

export type FormData = InferType<typeof userSetupschema>;

export default function UserSetupPage() {
  const params = useSearchParams();
  const token = params.get("setup_account_token");
  const email = params.get("user_email");

  console.log(email);
  const { loading, setLoading } = useGlobalStore();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [err, setErr] = useState({
    message: "",
    isError: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(userSetupschema) });

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      setLoading(true);
      const res: any = await verifyUserSetupToken(token);

      if (res.isVerified || !res?.error) {
        setUser(res?.user);
        setVerified(true);
        setValue("email", res.user.email);
        setLoading(false);
      } else {
        setErr({
          isError: true,
          message: res?.msg || "Unable to verify user setup token!",
        });
        toaster.create({
          description: res?.msg || "Unable to verify user setup token!",
          type: "error",
        });
      }
    };

    verify();
  }, [token]);

  // useEffect(() => {
  //   if (err?.isError === "jwt expired") {
  //   }
  // }, [err]);

  const onSubmit = async (data: FormData) => {
    setLoadingBtn(true);
    const res: any = await setupUser({
      email: data.email,
      id: user?._id as string,
      password: data.password,
    });

    if (res?.success) {
      toaster.create({
        description: "Successfully setup your account!",
        type: "success",
      });

      router.push("/login");
    } else {
      toaster.create({
        description: res?.msg || "Failed to setup account. Please try again.",
        type: "error",
      });
    }

    setLoadingBtn(false);
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (!verified) {
      return (
        <Center flexDirection={"column"}>
          <BiError color="red" size={100} />
          <Heading textAlign="center" color="red.500">
            Invalid or missing setup token!
          </Heading>
        </Center>
      );
    }
    return (
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" w="full" maxW="md">
        <Heading mb={6} textAlign="center">
          Setup your Account
        </Heading>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <VStack gap={4} alignItems={"start"}>
            <Inputs
              label="Email"
              placeholder="Enter your email"
              type="email"
              id="email"
              disabled
              errors={errors}
              register={register}
            />

            <Inputs
              label="Password"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              errors={errors}
              register={register}
              icon={
                showPassword ? (
                  <FaEyeSlash
                    cursor={"pointer"}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    cursor={"pointer"}
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />

            <Inputs
              label="Confirm Password"
              id="confirmPassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              errors={errors}
              register={register}
              icon={
                showConfirmPassword ? (
                  <FaEyeSlash
                    cursor={"pointer"}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <FaEye
                    cursor={"pointer"}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )
              }
            />

            <Button
              disabled={loadingBtn}
              mt={2}
              type="submit"
              colorScheme="blue"
              w="full"
            >
              {loadingBtn ? <Spinner /> : "Sign In"}
            </Button>
          </VStack>
        </form>
      </Box>
    );
  };
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      {renderContent()}
    </Box>
  );
}
