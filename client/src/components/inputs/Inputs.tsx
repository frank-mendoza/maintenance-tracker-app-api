"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  HStack,
  Input,
  InputGroup,
  NumberInput,
  RadioGroup,
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
  items,
  disabled,
  value,
}: {
  type?: any;
  placeholder: string;
  label: string;
  register: any;
  errors: any;
  id: string;
  icon?: ReactNode;
  disabled?: boolean;
  items?: any;
  value?: any;
}) => {
  const props = {
    p: 4,
    disabled,
    placeholder,
    borderColor: errors[id] ? "red.500" : "gray.300",
  };

  const renderInputFields = () => {
    if (type === "radio")
      return (
        <RadioGroup.Root
          defaultValue="1"
          {...props}
          value={value}
          pl={0}
          pt={0}
          {...register(id)}
          colorPalette={value === "1" ? "green" : "gray"}
        >
          <HStack gap="6" justifyContent={"space-between"}>
            {Array.isArray(items) &&
              items.map((item: any) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
          </HStack>
        </RadioGroup.Root>
      );
    if (type === "textarea") {
      return <Textarea {...register(id)} id={id} autoresize {...props} />;
    }

    if (type === "number")
      return (
        <NumberInput.Root width={"100%"} min={0} defaultValue="0">
          <NumberInput.Control />
          <NumberInput.Input
            {...props}
            {...register(id, { valueAsNumber: true })}
          />
        </NumberInput.Root>
      );

    return (
      <Input
        type={
          type === "email" ? "email" : type === "password" ? "password" : "text"
        }
        {...register(id)}
        {...props}
      />
    );
  };
  return (
    <Box w="full">
      <Text mb={2}>{label}</Text>
      <Flex>
        <InputGroup endElement={icon}>{renderInputFields()}</InputGroup>
      </Flex>
      {errors[id] && (
        <Text
          mt={1}
          fontSize={12}
          color={"red.500"}
        >{`${errors[id]?.message}`}</Text>
      )}
    </Box>
  );
};

export default Inputs;
