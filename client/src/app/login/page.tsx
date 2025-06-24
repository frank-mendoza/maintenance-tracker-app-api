/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import Inputs from "@/components/inputs/Inputs";
import { toaster } from "@/components/ui/toaster";
import { loginUser } from "@/lib/api/auth";
import { fetchUser } from "@/lib/api/user";
import { userLoginSchema } from "@/lib/formValidator";
import useGlobalStore from "@/lib/store/useGlobalStore";
import { Box, Button, Heading, Spinner, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

export type FormData = InferType<typeof userLoginSchema>;
export default function LoginPage() {
  const { setUser, loading, setLoading } = useGlobalStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(userLoginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const res: any = await loginUser({
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toaster.create({
        description: res?.msg || "Failed to login. Please try again.",
        type: "error",
      });
    } else {
      toaster.create({
        description: "Successfully login!",
        type: "success",
      });

      const user: any = await fetchUser();
      if (user?.status === 200) {
        setUser(user.data.user);
      }
      router.push("/overview");
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
          Login
        </Heading>

        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <VStack gap={4} alignItems={"start"}>
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
              placeholder="Enter your password"
              type="password"
              id="password"
              errors={errors}
              register={register}
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
