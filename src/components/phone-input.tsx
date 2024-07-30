import countries, { CountryInterface } from "../data/country-phone";
import {
  ActionIcon,
  Group,
  InputLabel,
  InputWrapper,
  Popover,
  Select,
  SelectProps,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { CountryCode, isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { useRef, useState } from "react";
const flags = require("../countries-flags/index");

interface PhoneInput extends Omit<TextInputProps, "children" | "variant" | "value"> {
  containerProps?: React.ButtonHTMLAttributes<HTMLDivElement>;
}

export default function PhoneInput(props: PhoneInput) {
  const { containerProps = {}, className: inputCn, placeholder: inputPlaceholder = "", ...restInputProps } = props;
  const [value, setValue] = useState<string>("");
  const [selected, setSelected] = useState<CountryInterface>(countries.find(({ code }) => code === "AU")!);
  const selectRef = useRef<any>();
  const { className: containerCn, style: containerStyle, ...restContainerProps } = containerProps;
  const flagIcon = (code: string) => (
    <span
      dangerouslySetInnerHTML={{ __html: flags[code] }}
      style={{ width: "32px", display: "block", borderRadius: "2px", overflow: "hidden" }}
    />
  );

  const findCountryCode = (country: string, code: string) =>
    countries.find(({ name, dial_code }) => name === country && code === dial_code);

  const renderSelectOption: SelectProps["renderOption"] = ({ option, checked }) => {
    const { items }: any = option;
    return (
      <Group flex="1" gap="xs">
        {flagIcon(items.code)}&nbsp;&nbsp;
        {option.label}
      </Group>
    );
  };

  return (
    <InputWrapper>
      <InputLabel required={props.required}>Phone number</InputLabel>
      <div
        className={clsx("ur-phone-input flex items-center border border-[#E4E4E4] rounded-[7px]", containerCn)}
        style={containerStyle}
        {...restContainerProps}
      >
        <Popover trapFocus width="target" position="bottom-start" offset={{ mainAxis: 7, crossAxis: -10 }}>
          <Popover.Target>
            <ActionIcon
              variant="transparent"
              style={{
                "--ai-size": "55px",
              }}
            >
              {flagIcon(selected?.code || "")}
              <TriangleDownIcon width="25px" height="20px" color="#5C5C5C" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown className="h-[300px] shadow-none border-none bg-transparent ur-phone-input__popover !mt-0">
            <Select
              onDropdownClose={() => {
                // debugger;
              }}
              checkIconPosition="left"
              // leftSection={selected ? flagIcon(selected.code) : null}
              onChange={(value: any) => {
                value = value?.split(" ");
                let selected = findCountryCode(value.slice(0, value.length - 1).join(" "), value[value.length - 1]);
                if (selected) setSelected(selected);
              }}
              data={countries.map((c, i) => ({
                label: c.dial_code + " " + c.name,
                value: c.name + " " + c.dial_code,
                items: c,
              }))}
              value={selected ? selected.name + " " + selected?.dial_code : ""}
              ref={selectRef}
              searchable
              spellCheck={false}
              renderOption={renderSelectOption}
              classNames={{
                option: "ur-phone-input__country-option py-2",
                input: "rounded-t-md",
                dropdown:
                  "rounded-b-md border border-[#E4E4E4] border-t-0 p-0 mt-[-14px] shadow-[0_3px_8px_rgba(14, 14, 44, 0.1)]",
              }}
            />
          </Popover.Dropdown>
        </Popover>
        <Text className="ur-phone-input__country-code">{selected?.dial_code}</Text>
        <TextInput
          className={clsx(inputCn, "ur-phone-input__input !mb-0")}
          variant="transparent"
          value={value}
          placeholder={inputPlaceholder}
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
          {...restInputProps}
        />
      </div>
    </InputWrapper>
  );
}
