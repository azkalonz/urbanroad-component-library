import { parsePhone } from '@/utils';
import {
  ActionIcon,
  Group,
  InputError,
  InputLabel,
  InputWrapper,
  Popover,
  Select,
  SelectProps,
  Text,
  TextInput,
  TextInputProps,
} from '@mantine/core';
import { TriangleDownIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { Country, ICountry } from 'country-state-city';
import { CountryCode, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { useEffect, useMemo, useRef, useState } from 'react';
const flags = require('../countries-flags/index');

interface PhoneInput extends Omit<TextInputProps, 'children' | 'variant' | 'onChange'> {
  containerProps?: React.ButtonHTMLAttributes<HTMLDivElement>;
  error?: any;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onFocus?: () => any;
  value?: any;
}

export default function PhoneInput(props: PhoneInput) {
  const {
    onBlur,
    onChange,
    onFocus,
    error,
    value: remoteValue,
    containerProps = {},
    className: inputCn,
    placeholder: inputPlaceholder = '',
    ...restInputProps
  } = props;
  const countries = useMemo(
    () => Country.getAllCountries().sort((a, b) => a.phonecode.charCodeAt(0) - b.phonecode.charCodeAt(0)),
    []
  );
  const [value, setValue] = useState<string>(parsePhone(remoteValue).number);
  const [selected, setSelected] = useState<ICountry>(Country.getCountryByCode('AU')!);
  const selectRef = useRef<any>();
  const { className: containerCn, style: containerStyle, ...restContainerProps } = containerProps;
  const flagIcon = (code: string) => (
    <span
      dangerouslySetInnerHTML={{ __html: flags[code] }}
      style={{ width: '32px', display: 'block', borderRadius: '2px', overflow: 'hidden' }}
    />
  );
  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => {
    const { items }: any = option;
    return (
      <Group flex="1" gap="xs">
        {flagIcon(items?.isoCode)}&nbsp;&nbsp;
        {option.label}
      </Group>
    );
  };

  const phoneCode = (phoneCode: string) => (phoneCode.indexOf('+') >= 0 ? phoneCode : '+' + phoneCode);
  const getFormattedValue = (val = value) => (val ? '(' + phoneCode(selected.phonecode) + ') ' + val : '');

  useEffect(() => {
    if (remoteValue) {
      try {
        let { value } = JSON.parse(remoteValue);
        setValue(value);
      } catch (e) {}
    }
  }, [remoteValue]);

  useEffect(() => {
    if (onChange) {
      onChange(getFormattedValue());
    }
  }, [selected]);

  return (
    <InputWrapper>
      <InputLabel required={props.required}>Phone number</InputLabel>
      <div className={clsx('ur-phone-input', containerCn)} style={containerStyle} {...restContainerProps}>
        <Popover
          trapFocus
          clickOutsideEvents={['mouseup']}
          width="target"
          position="bottom-start"
          offset={{ mainAxis: 0, crossAxis: -10 }}
        >
          <Popover.Target>
            <ActionIcon
              variant="transparent"
              style={{
                '--ai-size': '55px',
              }}
            >
              {flagIcon(selected?.isoCode || '')}
              <TriangleDownIcon width="25px" height="20px" color="#5C5C5C" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown className="ur-phone-input__popover--dropdown">
            <Select
              classNames={{
                root: 'ur-phone-input__select',
                input: 'ur-phone-input__select--input',
                dropdown: 'ur-phone-input__select--dropdown',
              }}
              onDropdownClose={() => {
                // debugger;
              }}
              rightSectionPointerEvents="none"
              checkIconPosition="left"
              onChange={(value: any) => {
                setSelected(Country.getCountryByCode(value)!);
              }}
              data={countries.map((c, i) => ({
                label: phoneCode(c.phonecode),
                value: c?.isoCode,
                items: c,
              }))}
              value={selected?.isoCode}
              ref={selectRef}
              searchable
              spellCheck={false}
              renderOption={renderSelectOption}
            />
          </Popover.Dropdown>
        </Popover>
        <Text className="ur-phone-input__country-code text-nowrap">{phoneCode(selected.phonecode)}</Text>
        <TextInput
          className={clsx(inputCn, 'ur-phone-input__input !mb-0')}
          {...(error
            ? {
                styles: {
                  input: {
                    color: 'var(--mantine-color-error)',
                    '--input-placeholder-color': 'var(--mantine-color-error)',
                  },
                },
              }
            : {})}
          variant="transparent"
          value={value}
          placeholder={inputPlaceholder}
          onChange={(e) => {
            let code = selected?.isoCode as CountryCode;
            let value = e.target.value;
            let isValid = isValidPhoneNumber(value, code);
            if (isValid) {
              let phoneNumber = parsePhoneNumber(value, code);
              value = phoneNumber.format('NATIONAL');
            }
            if (onChange) {
              onChange(getFormattedValue(value));
            }
            setValue(value);
          }}
          {...restInputProps}
        />
      </div>
      {error && <InputError style={{ marginTop: 'calc(var(--mantine-spacing-xs) / 2)' }}>{error}</InputError>}
    </InputWrapper>
  );
}
