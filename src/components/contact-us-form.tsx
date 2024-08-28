import useMultiStepForm from '@/hooks/multi-step-form';
import { FormProps } from '@/types/form';
import { Button, Select, Stepper, Text, Textarea, TextInput } from '@mantine/core';
import PhoneInput from './phone-input';
import { parsePhone } from '@/utils';
import { isValidNumber } from 'libphonenumber-js';

export default function ContactUsForm(formParams: FormProps) {
  const { title } = formParams;
  const {
    form: { getInputProps },
    getFieldOptions,
    Navigation,
    MultiStepForm,
    isLoading,
  } = useMultiStepForm({
    ...formParams,
    stepsCount: 1,
    showPagination: false,
    formData: {
      enhanceGetInputProps: () => ({
        disabled: isLoading,
      }),
      initialValues: {
        phone: '',
        email: '',
        first_name: '',
        last_name: '',
        message: '',
        preferred_mode_of_contact: '-',
      },
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        ...['first_name', 'last_name'].reduce(
          (p, c) => ({ ...p, [c]: (value: string) => (value?.length ? null : 'Required') }),
          {}
        ),
        phone: (value: string) => {
          let { number_code } = parsePhone(value);
          return isValidNumber(number_code) ? null : 'Invalid phone number';
        },
      },
    },
  });

  return (
    <div className="max-w-sm m-[0_auto]">
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
              Submit
            </Button>
          </Navigation>
        }
      >
        <Stepper.Step disabled={isLoading}>
          <Text className="text-[24px] font-bold text-center my-[16px] font-lexend">{title}</Text>
          <div className="flex space-x-2">
            <TextInput
              {...getInputProps('first_name')}
              {...getFieldOptions('first_name', {
                label: 'First Name',
                placeholder: 'Enter your First Name',
              })}
              required
            />
            <TextInput
              {...getInputProps('last_name')}
              {...getFieldOptions('last_name', {
                label: 'Last Name',
                placeholder: 'Enter your Last Name',
              })}
              required
            />
          </div>
          <PhoneInput
            {...getInputProps('phone')}
            {...getFieldOptions('phone', {
              label: 'Phone Number',
              placeholder: 'Phone Number',
            })}
            width="100%"
            required
          />
          <TextInput
            {...getInputProps('email')}
            {...getFieldOptions('email', {
              label: 'Email',
              placeholder: 'Enter a valid email address',
            })}
            type="email"
            required
          />
          <Select
            {...getInputProps('preferred_mode_of_contact')}
            {...getFieldOptions('preferred_mode_of_contact', {
              label: 'Preferred Method of Contact',
              placeholder: '-',
            })}
            data={['Email', 'Phone']}
            searchable
          />
          <Textarea
            {...getInputProps('message')}
            {...getFieldOptions('message', {
              label: 'Message',
            })}
            classNames={{
              input: 'h-full',
              wrapper: 'h-[120px]',
            }}
          />
        </Stepper.Step>
      </MultiStepForm>
    </div>
  );
}
