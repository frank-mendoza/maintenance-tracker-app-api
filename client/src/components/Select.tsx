"use client";
import { Select, ListCollection, Text } from "@chakra-ui/react";

const SelectInput = ({
  items,
  placeholder,
  label,
  value,
  onChange,
  width,
  vertical,
  center,
  mb,
  errors,
  id,
  disabled,
}: {
  items: ListCollection<any>;
  placeholder: string;
  label: string;
  value: any;
  onChange: any;
  width?: string | number;
  vertical?: boolean;
  center?: boolean;
  mb?: boolean;
  errors?: any;
  id?: string;
  disabled?: boolean;
}) => {
  return (
    <>
      <Select.Root
        collection={items}
        flexDirection={vertical ? "column" : "row"}
        alignItems={center ? "center" : "start"}
        size="sm"
        gap={0}
        mb={mb ? 5 : 0}
        width={width || "auto"}
        value={value}
        disabled={disabled || false}
        onValueChange={onChange}
      >
        <Select.HiddenSelect />
        <Text mb={2}>{label}</Text>

        <Select.Control width={"100%"} minWidth={"auto"}>
          <Select.Trigger
            p={2}
            color="gray.500"
            borderColor={
              errors && errors[id as string] ? "red.500" : "gray.300"
            }
          >
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup mr={2}>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        {/* <Portal> */}
        <Select.Positioner>
          <Select.Content color="gray.500">
            {items.items.map((itm, idx) => (
              <Select.Item p={2} item={itm} key={idx}>
                {itm.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
        {/* </Portal> */}
      </Select.Root>
      {errors && errors[id as string] && (
        <Text
          mt={1}
          fontSize={12}
          color={"red.500"}
        >{`${errors[id as string]?.message}`}</Text>
      )}
    </>
  );
};
export default SelectInput;
