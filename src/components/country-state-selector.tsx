import { Select, SelectProps } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Country, State } from 'country-state-city';
import { ComponentType, useEffect, useMemo } from 'react';

interface CountryStateSelectorProps {
  selectCountryProps?: SelectProps;
  selectStateProps?: SelectProps;
  form: UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>;
}

export default function CountryStateSelector({
  selectStateProps,
  selectCountryProps,
  form,
}: CountryStateSelectorProps) {
  const countries = useMemo(
    () =>
      Country.getAllCountries()
        .sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
        .map((q) => ({
          value: q.isoCode,
          label: q.name,
        })),
    []
  );
  const states = useMemo(
    () =>
      [{ name: '-' }]
        .concat(State.getStatesOfCountry(form.getValues().country))
        .filter((obj1, i, arr) => arr.findIndex((obj2) => obj2.name === obj1.name) === i)
        .map((q) => ({
          value: q.name,
          label: q.name,
        })) || [],
    [form.getValues().country]
  );

  useEffect(() => {
    form.setFieldValue('state', '-');
  }, [form.getValues().country]);

  return (
    <>
      <Select {...selectCountryProps} data={countries} />
      <Select {...selectStateProps} data={states} />
    </>
  );
}
