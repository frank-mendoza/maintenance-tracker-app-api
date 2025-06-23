"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Input, InputGroup, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

const Inputs = ({
  type,
  placeholder,
  label,
  register,
  id,
  errors,
  icon,
}: {
  type?: any;
  placeholder: string;
  label: string;
  register: any;
  errors: any;
  id: string;
  icon?: ReactNode;
}) => (
  <Box w="full">
    <Text mb={2}>{label}</Text>
    <Flex>
      <InputGroup endElement={icon}>
        <Input
          type={
            type === "email"
              ? "email"
              : type === "password"
                ? "password"
                : "text"
          }
          id={id}
          {...register(id)}
          p={4}
          placeholder={placeholder}
          borderColor={errors[type] ? "red.500" : "gray.300"}
        />
      </InputGroup>
    </Flex>
    {errors[type] && (
      <Text
        mt={1}
        fontSize={12}
        color={"red.500"}
      >{`${errors[type]?.message}`}</Text>
    )}
  </Box>
);

export default Inputs;
