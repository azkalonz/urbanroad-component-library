import countries, { CountryInterface } from "@/data/country-phone";
import { ActionIcon, Group, Popover, Select, SelectProps, Text, TextInput } from "@mantine/core";
import clsx from "clsx";
import { CountryCode, isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useRef, useState } from "react";
const flags = require("@/countries-flags");

interface PhoneInput extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export default function PhoneInput(props: PhoneInput) {
  const { className, style, ...divProps } = props;
  const [value, setValue] = useState<string>("");
  const [selected, setSelected] = useState<CountryInterface>(countries.find(({ code }) => code === "AU")!);
  const selectRef = useRef<any>();
  const flagIcon = (code: string) => (
    <span dangerouslySetInnerHTML={{ __html: flags[code] }} style={{ width: "32px", display: "block" }} />
  );

  const findCountryCode = (country: string, code: string) =>
    countries.find(({ name, dial_code }) => name === country && code === dial_code);

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => {
    const { items }: any = option;
    return (
      <Group flex="1" gap="xs">
        {flagIcon(items.code)}
        {option.label}
      </Group>
    );
  };

  return (
    <div
      className={clsx("flex items-center", className)}
      style={{ width: "clamp(100px, 300px, 100%)", ...style }}
      {...divProps}
    >
      <div></div>
      <Popover trapFocus position="bottom" withArrow shadow="md">
        <Popover.Target>
          <ActionIcon variant="transparent">{flagIcon(selected?.code || "")}</ActionIcon>
        </Popover.Target>
        <Popover.Dropdown className="h-[300px]">
          <Select
            leftSection={selected ? flagIcon(selected.code) : null}
            onChange={(value: any) => {
              value = value?.split(" ");
              let selected = findCountryCode(value.slice(0, value.length - 1).join(" "), value[value.length - 1]);
              if (selected) setSelected(selected);
            }}
            data={countries.map((c, i) => ({
              label: c.name + " " + c.dial_code,
              value: c.name + " " + c.dial_code,
              items: c,
            }))}
            value={selected ? selected.name + " " + selected?.dial_code : ""}
            ref={selectRef}
            searchable
            renderOption={renderSelectOption}
            styles={{
              dropdown: {
                "--popover-border-color": "transparent",
              },
            }}
          />
        </Popover.Dropdown>
      </Popover>
      <Text>{selected?.dial_code}</Text>
      <TextInput
        variant="transparent"
        value={value}
        onChange={(e) => {
          let code = selected.code as CountryCode;
          let value = e.target.value;
          let isValid = isValidPhoneNumber(value, code);
          if (isValid) {
            let phoneNumber = parsePhoneNumber(value, code);
            value = phoneNumber.format("NATIONAL");
          }
          setValue(value);
        }}
      />
    </div>
  );
}
