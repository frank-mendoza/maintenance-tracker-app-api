"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  Input,
  InputGroup,
  NumberInput,
  Text,
  Textarea,
} from "@chakra-ui/react";
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
}) => {
  const renderInputFields = () => {
    if (type === "textarea") {
      return (
        <Textarea
          {...register(id)}
          id={id}
          autoresize
          p={4}
          placeholder={placeholder}
          borderColor={errors[type] ? "red.500" : "gray.300"}
        />
      );
    }

    if (type === "number")
      return (
        <NumberInput.Root width={"100%"} min={0} defaultValue="0">
          <NumberInput.Control />
          <NumberInput.Input
            p={4}
            placeholder={placeholder}
            borderColor={errors[type] ? "red.500" : "gray.300"}
            {...register("rent", { valueAsNumber: true, default: 0 })}
          />
        </NumberInput.Root>
      );

    return (
      <Input
        type={
          type === "email" ? "email" : type === "password" ? "password" : "text"
        }
        {...register(id)}
        // id={id}
        p={4}
        placeholder={placeholder}
        borderColor={errors[type] ? "red.500" : "gray.300"}
      />
    );
  };
  return (
    <Box w="full">
      <Text mb={2}>{label}</Text>
      <Flex>
        <InputGroup endElement={icon}>{renderInputFields()}</InputGroup>
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
};

export default Inputs;
