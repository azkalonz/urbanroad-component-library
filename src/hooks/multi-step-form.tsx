import { MultiStepFormProps } from '@/types/form';
import { getKeyByValue } from '@/utils';
import { Button, Group, Stepper, Text } from '@mantine/core';
import { FormErrors, useForm } from '@mantine/form';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { useMemo, useState } from 'react';

interface _MultiStepForm {
  formData: any;
  stepErrors?: { [key: number]: { fields: string[] } };
  stepsCount: number;
}

export default function useMultiStepForm(params: MultiStepFormProps & _MultiStepForm) {
  const {
    formData,
    stepErrors,
    stepsCount,
    webhookUrl,
    webhookType = 'POST',
    redirectUrl,
    redirectDelay = 0,
    formCompleteText = 'Form submitted sucessfully.Thank you!',
  } = params;
  const form = useForm(formData);
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const validate = (
    goNextStep: boolean = true,
    callback: (error?: { index: number; allStepErrors: any }) => void = () => {}
  ) => {
    if (!stepErrors?.[active]) return {};
    const validate = form.validate();
    const { errors } = validate;
    const allStepErrors: { [key: number]: any } = {};
    for (let i = 0; i < stepsCount; i++) {
      allStepErrors[i] = Object.keys(errors).some((r: string) => stepErrors[i].fields.includes(r));
    }
    let stepHasErrors = allStepErrors[active];
    if (!stepHasErrors) {
      if (goNextStep) nextStep();
      form.clearErrors();
      return callback();
    } else {
      let firstStepError = getKeyByValue(allStepErrors, true);
      if (firstStepError) {
        let errorIndex = parseInt(firstStepError);
        setActive(errorIndex);
        return callback({ index: errorIndex, allStepErrors });
      }
      return callback();
    }
  };

  const handleNextStep = (index?: number) => {
    if (typeof index !== 'number') {
      validate();
    } else {
      form.clearErrors();
      setActive(index);
    }
  };

  const makeStepIcon = (step: number, description: string) => {
    let icon =
      active === step - 1 ? (
        <Text>
          <b>Step {step}:</b> {description}
        </Text>
      ) : (
        <Text>Step {step}</Text>
      );
    return {
      icon,
      completedIcon: icon,
    };
  };

  const Navigation = useMemo(
    () =>
      ({ children }: { children?: React.ReactNode }) => (
        <Group justify="space-between" wrap="nowrap" gap={16} mt="32px">
          <Button
            p={0}
            className="shrink-0"
            classNames={{
              label: 'ur-link-button__label',
            }}
            variant="transparent"
            onClick={prevStep}
            leftSection={<ChevronLeftIcon />}
            w="92px"
          >
            <Text className="underline ">Back</Text>
          </Button>
          {!children && (
            <Button
              onClick={() => handleNextStep()}
              fullWidth
              radius="100px"
              classNames={{ label: 'ur-pill-button__label' }}
            >
              Next
            </Button>
          )}
          {!!children && children}
        </Group>
      ),
    [active]
  );

  const handleSubmit = (values: Record<string, any>) => {
    try {
      if (webhookUrl) {
        console.log('submit to ' + webhookUrl);
        // fetch(webhookUrl, { method: webhookType });
      }
      if (redirectUrl) {
        (window as any).__submitFormTimeout = setTimeout(() => {
          console.log('redirect to ' + redirectUrl);
        }, redirectDelay * 1000);
      }
    } catch (e) {}
    return false;
  };

  const MultiStepForm = useMemo(
    () =>
      function ({ children, completeComponent }: { children: React.ReactNode; completeComponent?: React.ReactNode }) {
        return (
          <>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
              <Stepper active={active} onStepClick={handleNextStep}>
                {children}
              </Stepper>
              {active === stepsCount - 1 && completeComponent}
            </form>
            {completeComponent ? active < stepsCount - 1 && <Navigation /> : <Navigation />}
          </>
        );
      },
    [active]
  );

  const getFieldOptions = (field: string, defaultOptions?: Record<string, any>) => {
    if (!params?.fieldOptions?.[field]) {
      return defaultOptions;
    }
    return params.fieldOptions[field];
  };

  return {
    MultiStepForm,
    Navigation,
    validate,
    makeStepIcon,
    nextStep,
    prevStep,
    getFieldOptions,
    form,
  };
}
