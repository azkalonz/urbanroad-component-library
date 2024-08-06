import PhoneInput from '@/components/phone-input';
import useMultiStepForm from '@/hooks/multi-step-form';
import { termsAndConditionOfTrade } from '@/lib/terms-and-condition-of-trade';
import { MultiStepFormProps } from '@/types/form';
import { parsePhone } from '@/utils';
import {
  Anchor,
  Button,
  Checkbox,
  Drawer,
  Flex,
  Group,
  MultiSelect,
  ScrollArea,
  Select,
  Stepper,
  TagsInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { parseAddress } from 'addresser';
import { Country, State } from 'country-state-city';
import { isValidNumber } from 'libphonenumber-js';
import { useEffect, useMemo, useRef } from 'react';

export default function WholesaleRegistrationForm(formParams: MultiStepFormProps) {
  const {
    title = 'Wholesale Registration',
    termsOfTrade: {
      checkboxLabel = 'I agree to the Urban Road <a href="#">Terms of Trade</a>',
      buttonLabel = 'I agree to the terms of trade',
      popupContent = termsAndConditionOfTrade || [],
      popupTitle = 'Terms and Conditions of Trade',
    } = {},
    newsletterCheckboxLabel = 'I consent to receive the Urban Road newsletter',
    businessTypeOptions = [
      'Stockist – Ecommerce',
      'Stockist – Store Front',
      'Interior Designer',
      'Property Stylist',
      'Commercial',
      'Media',
    ],
    interestOptions = ['Wall Art', 'Wallpaper', 'Homewares', 'Furniture', 'Commercial'],
    leadSourceOptions = [
      'Google Search',
      'Other Search Engine',
      'Word of Mouth',
      'Referral',
      'Email',
      'Facebook',
      'Instagram',
      'Pinterest',
      'TikTok',
      'LinkedIn',
      'Other',
    ],
  } = formParams;
  const { MultiStepForm, form, makeStepIcon, Navigation, getFieldOptions, isLoading } = useMultiStepForm({
    stepsCount: 3,
    ...formParams,
    formData: {
      enhanceGetInputProps: () => ({
        disabled: isLoading,
      }),
      initialValues: {
        subscribe_to_newsletter: false,
        agree_to_terms_of_trade: false,
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        company_name: '',
        country: '',
        suburb: '',
        state: '',
        address: '',
        postcode: '',
        abn_acn: '',
        business_type: '',
        facebook_url: '',
        instagram_url: '',
        website_url: '',
        lead_source: [],
        referred_by: '',
        other_lead_source: '',
        interest: [],
        trade_references: [],
      },
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        referred_by: (value: string, values: any) =>
          values.lead_source.includes('Referral') ? (value?.length ? null : 'Required') : null,
        other_lead_source: (value: string, values: any) =>
          values.lead_source.includes('Other') ? (value?.length ? null : 'Required') : null,
        website_url: (value: string) =>
          /(https?:\/\/[^\s]+)/g.test(value) ? null : "The URL must start with 'http://' or 'https://'.",
        facebook_url: (value: string) =>
          !value?.length
            ? null
            : /(https?:\/\/[^\s]+)/g.test(value)
              ? null
              : "The URL must start with 'http://' or 'https://'.",
        instagram_url: (value: string) =>
          !value?.length
            ? null
            : /(https?:\/\/[^\s]+)/g.test(value)
              ? null
              : "The URL must start with 'http://' or 'https://'.",
        phone: (value: string) => {
          let { number_code } = parsePhone(value);
          return isValidNumber(number_code) ? null : 'Invalid phone number';
        },
        // required fields
        ...[
          'first_name',
          'last_name',
          'company_name',
          'country',
          'suburb',
          'state',
          'address',
          'postcode',
          'abn_acn',
          'business_type',
          'lead_source',
          'interest',
          'trade_references',
        ].reduce((p, c) => ({ ...p, [c]: (value: string) => (value?.length ? null : 'Required') }), {}),
      },
    },
    stepErrors: {
      0: {
        fields: ['first_name', 'last_name', 'email', 'phone'],
      },
      1: {
        fields: ['company_name', 'country', 'suburb', 'state', 'address', 'postcode', 'abn_acn', 'business_type'],
      },
      2: {
        fields: ['website_url', 'lead_source', 'interest', 'trade_references', 'referred_by', 'other_lead_source'],
      },
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const leadSourceRef = useRef<HTMLInputElement>(null);
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
    () => [{ name: '-' }].concat(State.getStatesOfCountry(form.getValues().country)),
    [form.getValues().country]
  );

  const FormTitle = useMemo(
    () => () => <Text className="text-[24px] font-bold text-center my-[16px] font-lexend">{title}</Text>,
    []
  );

  useEffect(() => {
    let address = form.getValues().address;
    if (address.length) {
      try {
        address = parseAddress(address);
        let s = State.getAllStates().find((q) => q.name === address.stateName);
        address = {
          postcode: address.zipCode,
          suburb: address.placeName,
          state: s?.name,
          country: Country.getCountryByCode(s?.countryCode!)?.isoCode,
        };

        Object.keys(address).forEach((field) => {
          form.setFieldValue(field, address[field]);
        });
      } catch (e) {}
    }
  }, [form.getValues().address]);

  useEffect(() => {
    if (!form.getValues().lead_source.includes('Other') && form.getValues().other_lead_source) {
      form.setFieldValue('other_lead_source', '');
    }
    if (!form.getValues().lead_source.includes('Referral') && form.getValues().referred_by) {
      form.setFieldValue('referred_by', '');
    }
  }, [form.getValues().lead_source]);

  useEffect(() => {
    if (states.length <= 1) {
      form.setFieldValue('state', '-');
    }
  }, [states]);

  return (
    <div className="max-w-sm m-[0_auto]">
      <Drawer
        opened={opened}
        onClose={close}
        title={<h1 className="font-lexend text-[20px] font-[700]">{popupTitle}</h1>}
        size="lg"
        overlayProps={{ backgroundOpacity: 0.4 }}
        scrollAreaComponent={ScrollArea.Autosize}
        classNames={{
          body: 'max-w-[494px] m-[0_auto]',
          header: 'max-w-[494px] m-[0_auto] pt-[40px]',
        }}
      >
        {popupContent.map(({ title, description }, index) => (
          <div key={title} className="my-[16px]">
            <h3 className="font-open-sans text-[16px] font-[700]">{title}</h3>
            <p dangerouslySetInnerHTML={{ __html: description }} className="my-[16px]" />
            {index < popupContent.length - 1 && <hr />}
          </div>
        ))}
        <Button
          className="black-outline"
          variant="outline"
          onClick={() => {
            form.getInputProps('agree_to_terms_of_trade').onChange(true);
            close();
          }}
        >
          I agree to the terms of trade
        </Button>
      </Drawer>
      <MultiStepForm
        lastPageNav={
          <Navigation>
            <Button
              type="submit"
              fullWidth
              radius="100px"
              classNames={{ label: 'ur-pill-button__label', root: 'ur-pill-button--light' }}
              disabled={isLoading}
            >
              Register
            </Button>
          </Navigation>
        }
      >
        <Stepper.Step disabled={isLoading} {...makeStepIcon(1, 'Your details')}>
          <FormTitle />
          <TextInput
            {...form.getInputProps('first_name')}
            {...getFieldOptions('first_name', {
              label: 'First Name',
              placeholder: 'Enter your First Name',
            })}
            required
          />
          <TextInput
            {...form.getInputProps('last_name')}
            {...getFieldOptions('last_name', {
              label: 'Last Name',
              placeholder: 'Enter your Last Name',
            })}
            required
          />
          <TextInput
            {...form.getInputProps('email')}
            {...getFieldOptions('email', {
              label: 'Email Address',
              placeholder: 'Enter a valid email address',
            })}
            required
            key={form.key('email')}
          />
          <PhoneInput
            {...form.getInputProps('phone')}
            {...getFieldOptions('phone', {
              label: 'Phone Number',
              placeholder: 'Phone Number',
            })}
            width="100%"
            required
          />
          <Checkbox
            {...form.getInputProps('subscribe_to_newsletter')}
            {...getFieldOptions('subscribe_to_newsletter', {
              label: <span dangerouslySetInnerHTML={{ __html: newsletterCheckboxLabel }} />,
            })}
            checked={form.getValues().subscribe_to_newsletter}
            className="mt-[16px]"
          />
        </Stepper.Step>
        <Stepper.Step disabled={isLoading} {...makeStepIcon(2, 'Company details')}>
          <FormTitle />
          <TextInput
            {...form.getInputProps('company_name')}
            {...getFieldOptions('company_name', {
              label: 'Company name',
              placeholder: 'Company name',
            })}
            required
          />
          <TextInput
            {...form.getInputProps('address')}
            {...getFieldOptions('address', {
              label: 'Billing Address',
              placeholder: 'Address',
            })}
            required
          />
          <Flex gap="8px" mb="8px">
            <TextInput
              {...form.getInputProps('postcode')}
              {...getFieldOptions('postcode', {
                label: 'Postcode',
                placeholder: 'Postcode',
              })}
              required
              w="100%"
            />
            <TextInput
              {...form.getInputProps('suburb')}
              {...getFieldOptions('suburb', {
                label: 'Suburb',
                placeholder: 'Suburb',
              })}
              required
              w="100%"
            />
          </Flex>
          <Flex gap="8px" mb="8px">
            <Select
              {...form.getInputProps('country')}
              {...getFieldOptions('country', {
                label: 'Country',
                placeholder: 'Country',
              })}
              required
              allowDeselect={false}
              withCheckIcon={false}
              data={countries}
              key={form.key('country')}
              searchable
              w="100%"
            />
            <Select
              {...form.getInputProps('state')}
              {...getFieldOptions('state', {
                label: 'State',
                placeholder: 'State',
              })}
              required
              allowDeselect={false}
              withCheckIcon={false}
              data={
                states
                  .filter((obj1, i, arr) => arr.findIndex((obj2) => obj2.name === obj1.name) === i)
                  .map((q) => ({
                    value: q.name,
                    label: q.name,
                  })) || []
              }
              limit={100}
              key={form.key('state')}
              searchable
              w="100%"
            />
          </Flex>
          <TextInput
            {...form.getInputProps('abn_acn')}
            {...getFieldOptions('abn_acn', {
              label: 'ABN / ACN',
              placeholder: 'ABN / ACN',
            })}
            required
            w="100%"
          />
          <Select
            {...form.getInputProps('business_type')}
            {...getFieldOptions('business_type', {
              label: 'Business Type',
              placeholder: 'Select your Business Type',
            })}
            required
            data={businessTypeOptions}
            limit={100}
            key={form.key('state')}
            searchable
          />
        </Stepper.Step>
        <Stepper.Step disabled={isLoading} {...makeStepIcon(3, 'Other details')}>
          <FormTitle />
          <TextInput
            {...form.getInputProps('facebook_url')}
            {...getFieldOptions('facebook_url', {
              label: 'Facebook URL (optional)',
              placeholder: 'Facebook',
            })}
            w="100%"
          />
          <TextInput
            {...form.getInputProps('instagram_url')}
            {...getFieldOptions('instagram_url', {
              label: 'Instagram URL (optional)',
              placeholder: 'Instagram',
            })}
            w="100%"
          />
          <TextInput
            {...form.getInputProps('website_url')}
            {...getFieldOptions('website_url', {
              label: 'Website URL',
              placeholder: 'https://yourwebsite.com.au',
            })}
            required
            w="100%"
          />
          <MultiSelect
            {...form.getInputProps('lead_source')}
            {...getFieldOptions('lead_source', {
              label: 'How did you hear about us?',
            })}
            ref={leadSourceRef}
            onChange={(value) => {
              form.getInputProps('lead_source').onChange(value);
              leadSourceRef.current?.blur();
            }}
            required
            data={leadSourceOptions}
            searchable
            mb="8px"
            classNames={{
              input: '!h-auto min-h-[48px] flex items-center',
            }}
          />
          {form.getValues().lead_source.includes('Referral') && (
            <TextInput
              {...form.getInputProps('referred_by')}
              {...getFieldOptions('referred_by', {
                label: 'Enter referee or provide a link',
                placeholder: 'Referee / Link',
              })}
              required
              w="100%"
            />
          )}
          {form.getValues().lead_source.includes('Other') && (
            <TextInput
              {...form.getInputProps('other_lead_source')}
              {...getFieldOptions('other_lead_source', {
                label: 'Enter additional information',
                placeholder: 'Other (Please Specify)',
              })}
              required
              w="100%"
            />
          )}
          <Checkbox.Group
            {...form.getInputProps('interest')}
            {...getFieldOptions('interest', {
              label: 'What products interest you the most?',
            })}
            withAsterisk
            mb="8px"
          >
            <Group
              mt="xs"
              display="grid"
              style={{
                gridTemplateColumns: 'repeat(3,1fr)',
              }}
            >
              {interestOptions.map((interest: string) => (
                <Checkbox value={interest} label={interest} key={interest} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          <TagsInput
            {...form.getInputProps('trade_references')}
            maxTags={2}
            {...getFieldOptions('trade_references', {
              label: 'Trade References',
              placeholder: 'Please provide two trade references',
            })}
            required
            classNames={{
              input: '!h-auto min-h-[48px] flex items-center',
            }}
          />
          <Checkbox
            {...form.getInputProps('agree_to_terms_of_trade')}
            {...getFieldOptions('agree_to_terms_of_trade', {
              label: <span dangerouslySetInnerHTML={{ __html: checkboxLabel }} />,
            })}
            checked={form.getValues().agree_to_terms_of_trade}
            mt="16px"
            required
            onChange={(e) => {
              if (e.target.checked) {
                open();
              }
            }}
            className="mt-[8px]"
          />
        </Stepper.Step>
      </MultiStepForm>
    </div>
  );
}
