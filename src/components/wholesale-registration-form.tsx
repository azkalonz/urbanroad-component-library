import PhoneInput from '@/components/phone-input';
import useMultiStepForm from '@/hooks/multi-step-form';
import { termsAndConditionOfTrade } from '@/lib/terms-and-condition-of-trade';
import { WholesaleRegistrationFormProps } from '@/types/form';
import { parsePhone } from '@/utils';
import {
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
import axios from 'axios';
import { isValidNumber } from 'libphonenumber-js';
import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';

const CountryStateSelectorLazy = lazy(() => import('./country-state-selector'));

export default function WholesaleRegistrationForm(formParams: WholesaleRegistrationFormProps) {
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
    ...formParams,
    stepsCount: 3,
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
        phone_unformatted: '',
        email: '',
        company_name: '',
        country: '',
        suburb: '',
        state: '',
        address: '',
        postcode: '',
        abn_acn: '',
        abn: '',
        acn: '',
        is_acn: false,
        business_type: '',
        facebook_url: '',
        instagram_url: '',
        website_url: '',
        lead_source: [],
        referred_by: '',
        other_lead_source: '',
        interest: [],
        trade_references: [],
        inconsistent_company_info: false,
        source: window.location.href,
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
    async beforeSubmit({ values, form, setActive }) {
      const newValues: any = {};
      if (values.phone) {
        let i = values.phone.indexOf(') ');
        let unformatted = values.phone.substring(i + 2);
        newValues.phone_unformatted = unformatted;
      }

      const getAbnDetails = (data: string) => {
        data = data.replace('callback(', '').replace('})', '}');
        return JSON.parse(data);
      };
      let abnLookUp = await axios.get(
        `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${values.abn_acn}&callback=callback&guid=76c707f6-1c3a-432e-9d6a-96ed87c604bc`
      );
      let abnAcn = getAbnDetails(abnLookUp.data);
      if (!abnAcn.Abn) {
        abnLookUp = await axios.get(
          `https://abr.business.gov.au/json/AcnDetails.aspx?acn=${values.abn_acn}&callback=callback&guid=76c707f6-1c3a-432e-9d6a-96ed87c604bc`
        );
        abnAcn = getAbnDetails(abnLookUp.data);
        if (abnAcn.Acn) {
          newValues.is_acn = true;
        }
      } else {
        newValues.is_acn = false;
      }
      if (!abnAcn.Abn) {
        setActive(1);
        form.setFieldError('abn_acn', 'Invalid ABN/ACN');
        return {
          error:
            'Please check your information and try again. If the problem persists, you might want to contact support.',
        };
      }
      newValues.abn = abnAcn.Abn;
      newValues.acn = abnAcn.Acn;
      if (
        abnAcn.EntityName.toLowerCase() !== values.company_name.toLowerCase() &&
        !abnAcn.BusinessName?.map((q: string) => q.toLowerCase()).includes(values.company_name.toLowerCase())
      ) {
        newValues.inconsistent_company_info = true;
      } else {
        newValues.inconsistent_company_info = false;
      }
      return { newValues };
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  const leadSourceRef = useRef<HTMLInputElement>(null);

  const FormTitle = useMemo(
    () => () => <Text className="text-[24px] font-bold text-center my-[16px] font-lexend">{title}</Text>,
    []
  );

  useEffect(() => {
    if (!form.getValues().lead_source.includes('Other') && form.getValues().other_lead_source) {
      form.setFieldValue('other_lead_source', '');
    }
    if (!form.getValues().lead_source.includes('Referral') && form.getValues().referred_by) {
      form.setFieldValue('referred_by', '');
    }
  }, [form.getValues().lead_source]);

  return (
    <div className="max-w-[383px] m-[0_auto]">
      <Drawer
        opened={opened}
        onClose={close}
        title={popupTitle}
        size="lg"
        overlayProps={{ backgroundOpacity: 0.4 }}
        scrollAreaComponent={ScrollArea.Autosize}
        classNames={{
          body: 'max-w-[494px] m-[0_auto]',
          header: 'max-w-[494px] m-[0_auto] pt-[40px]',
          title: 'font-lexend text-[20px] !font-[700]',
        }}
      >
        {popupContent.map(({ title, description }, index) => (
          <div key={title} className="my-[16px]">
            <h3 className="font-open-sans text-[16px] font-[700]">{title}</h3>
            <p dangerouslySetInnerHTML={{ __html: description }} className="my-[16px] text-[16px]" />
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
          {buttonLabel}
        </Button>
      </Drawer>
      <MultiStepForm
        lastPageNav={
          <Navigation>
            <Button
              type="submit"
              fullWidth
              radius="100px"
              classNames={{ label: 'ur-pill-button__label', root: 'ur-pill-button--light !h-[36px]' }}
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
            <Suspense
              fallback={
                <>
                  <Select required label="Country" placeholder="Country" />
                  <Select required label="State" placeholder="-" />
                </>
              }
            >
              <CountryStateSelectorLazy
                form={form}
                selectCountryProps={{
                  required: true,
                  allowDeselect: false,
                  withCheckIcon: false,
                  searchable: true,
                  w: '100%',
                  ...getFieldOptions('country', {
                    label: 'Country',
                    placeholder: 'Country',
                  }),
                  ...form.getInputProps('country'),
                }}
                selectStateProps={{
                  required: true,
                  allowDeselect: false,
                  withCheckIcon: false,
                  searchable: true,
                  w: '100%',
                  limit: 100,
                  ...getFieldOptions('state', {
                    label: 'State',
                    placeholder: 'State',
                  }),
                  ...form.getInputProps('state'),
                }}
              />
            </Suspense>
          </Flex>
          <TextInput
            {...form.getInputProps('abn_acn')}
            {...getFieldOptions('abn_acn', {
              label: 'ABN / ACN',
              placeholder: 'ABN / ACN',
            })}
            required
            w="100%"
            onKeyUp={(e) => {
              let val = parseInt(e.currentTarget.value);
              if (val < 0) {
                e.currentTarget.value = '';
              }
            }}
            type="number"
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
            onDropdownClose={() => {
              debugger;
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
