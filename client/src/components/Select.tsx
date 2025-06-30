/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, ListCollection } from "@chakra-ui/react";

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
}) => {
  return (
    <Select.Root
      collection={items}
      flexDirection={vertical ? "column" : "row"}
      alignItems={center ? "center" : "start"}
      size="sm"
      mb={mb ? 5 : 0}
      width={width || "auto"}
      value={value}
      onValueChange={onChange}
    >
      <Select.HiddenSelect />
      <Select.Label fontWeight={500} minW={100}>
        {label}:
      </Select.Label>
      <Select.Control width={"100%"} minWidth={"auto"}>
        <Select.Trigger p={2} color="gray.500">
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup mr={2}>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      {/* <Portal> */}
      <Select.Positioner>
        <Select.Content color="gray.500">
          {items.items.map((framework) => (
            <Select.Item p={2} item={framework} key={framework.value}>
              {framework.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
      {/* </Portal> */}
    </Select.Root>
  );
};
export default SelectInput;
