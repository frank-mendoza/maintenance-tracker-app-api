"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Box,
  Button,
  VStack,
  Heading,
  GridItem,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterSchema } from "@/lib/formValidator";
import { InferType } from "yup";
import { toaster } from "@/components/ui/toaster";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import Inputs from "@/components/inputs/Inputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import useGlobalStore from "@/lib/store/useGlobalStore";

export type FormData = InferType<typeof userRegisterSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(userRegisterSchema),
  });

  const { loading, setLoading } = useGlobalStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      lastName: data.lastname,
    });

    if (res.success) {
      toaster.create({
        description: "Successfully registered!",
        type: "success",
      });

      router.push("/login");
    } else {
      toaster.create({
        description: res?.data?.msg || "Failed to register. Please try again.",
        type: "error",
      });
    }

    setLoading(false);
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
      <Box bg="white" p={8} borderRadius="md" boxShadow="md" w="full" maxW="md">
        <Heading mb={6} textAlign="center">
          Create an Account
        </Heading>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <VStack gap={4} alignItems={"start"}>
            <SimpleGrid transition={"all ease-in-out"} columns={2} gap={6}>
              <GridItem>
                <Inputs
                  label="First Name"
                  placeholder="Enter your first name"
                  id="name"
                  errors={errors}
                  register={register}
                />
              </GridItem>
              <GridItem>
                <Inputs
                  label="Last Name"
                  placeholder="Enter your last name"
                  id="lastname"
                  errors={errors}
                  register={register}
                />
              </GridItem>
            </SimpleGrid>

            <Inputs
              label="Email"
              placeholder="Enter your email"
              type="email"
              id="email"
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
              disabled={loading}
              mt={2}
              type="submit"
              colorScheme="blue"
              w="full"
            >
              {loading ? <Spinner /> : "Sign In"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
