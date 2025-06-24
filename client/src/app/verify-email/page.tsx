"use client";
import { Loading } from "@/components/Loading";
import { toaster } from "@/components/ui/toaster";
import { verifyUserEmail } from "@/lib/api/auth";
/* eslint-disable @typescript-eslint/no-explicit-any */

import useGlobalStore from "@/lib/store/useGlobalStore";
import { Button, Center, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCheck, BiError } from "react-icons/bi";

const VerifyEmail = () => {
  const { loading, setLoading } = useGlobalStore();
  const router = useRouter();
  const params = useSearchParams();

  const [verified, setVerified] = useState(false);
  const [isVerifiedErr, setIsVerifiedErr] = useState(false);

  const token = params.get("verificationToken");
  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      setLoading(true);
      const res: any = await verifyUserEmail(token);

      if (res?.error) {
        if (res?.msg === "Email is already verified.") {
          router.push("/login");
        } else {
          setIsVerifiedErr(true);
        }
      } else {
        toaster.create({
          description: res?.data?.msg || "Successfully verified",
          type: "success",
        });
        setVerified(true);
      }
      setLoading(false);
    };

    verify();
  }, [token]);

  const renderContent = () => {
    if (isVerifiedErr)
      return (
        <>
          <BiError color="red" size={50} />
          <Text mt={2} color="colorPalette.600">
            Failed to Verify Token
          </Text>
        </>
      );

    if (verified)
      return (
        <>
          <BiCheck color="green" size={50} />
          <Text my={2} color="colorPalette.600">
            Verified Successfully
          </Text>

          <Button onClick={() => router.push("/login")}>Login Now</Button>
        </>
      );

    return null;
  };
  if (loading) return <Loading />;
  return (
    <Center
      flexDirection={"column"}
      gap={"8px"}
      height={"100vh"}
      width={"100%"}
    >
      {renderContent()}
    </Center>
  );
};
export default VerifyEmail;
