import { MultiStepFormProps } from '@/types/form';
import { getKeyByValue } from '@/utils';
import { Alert, Button, Group, Stepper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CheckCircledIcon, ChevronLeftIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { useMemo, useState } from 'react';

export default function useMultiStepForm(params: MultiStepFormProps) {
  const {
    formData,
    stepErrors,
    stepsCount = 0,
    webhookUrl,
    redirectUrl,
    redirectDelay = 0,
    resetFormDelay = 3,
    showPagination = true,
    formCompleteText = 'Form submitted sucessfully.Thank you!',
    errorMessage = "We're sorry, but your form could not be submitted at this time. Please check your information and try again. If the problem persists, you might want to contact support.",
    beforeSubmit,
  } = params;
  const form = useForm(formData);
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    let subsequentStepError = getKeyByValue(allStepErrors, true);

    if (!stepHasErrors) {
      if (goNextStep) nextStep();
      form.clearErrors();
      return callback();
    } else if (subsequentStepError) {
      let errorIndex = parseInt(subsequentStepError);
      setActive(errorIndex);
      return callback({ index: errorIndex, allStepErrors });
    } else {
      return callback();
    }
  };

  const handleNextStep = (index?: number) => {
    setError(null);
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
        <Text className="!text-[14px]">
          <b>Step {step}:</b> {description}
        </Text>
      ) : (
        <Text className="!text-[14px]">Step {step}</Text>
      );
    return {
      icon,
      completedIcon: icon,
    };
  };

  const Navigation = useMemo(
    () =>
      ({ children }: { children?: React.ReactNode }) =>
        (
          <Group justify="space-between" wrap="nowrap" gap={16} mt="32px">
            {active > 0 && (
              <Button
                p={0}
                className="shrink-0"
                classNames={{
                  label: 'ur-link-button__label',
                }}
                variant="transparent"
                onClick={!isLoading ? prevStep : () => {}}
                leftSection={<ChevronLeftIcon />}
                w="92px"
              >
                <Text className="underline ">Back</Text>
              </Button>
            )}
            {!children && (
              <Button
                onClick={() => handleNextStep()}
                fullWidth
                radius="100px"
                classNames={{ label: 'ur-pill-button__label', root: '!h-[36px]' }}
                disabled={isLoading}
              >
                Next
              </Button>
            )}
            {!!children && children}
          </Group>
        ),
    [active, isLoading]
  );

  const handleSubmit = async (values: Record<string, any>) => {
    let hasError = false;
    setIsLoading(true);
    setError(null);

    if (beforeSubmit) {
      let { error = null, newValues } = await beforeSubmit({ values, form, setActive });
      if (error) {
        setError(error);
        setIsLoading(false);
        setSubmitted(false);
        return;
      }
      if (newValues) {
        values = { ...values, ...newValues };
      }
    }

    try {
      if (webhookUrl) {
        await axios.post(webhookUrl, values).catch((e) => {
          setError(errorMessage);
          hasError = true;
        });
      }
      if (hasError) {
        setIsLoading(false);
        setSubmitted(false);
        return;
      }
      setIsLoading(false);
      setSubmitted(true);
      if (redirectUrl) {
        (window as any).__submitFormTimeout = setTimeout(() => {
          (window as any).location = redirectUrl;
        }, redirectDelay * 1000);
      }
      if (resetFormDelay) {
        setTimeout(() => {
          setSubmitted(false);
          setActive(0);
          form.reset();
        }, resetFormDelay * 1000);
      }
    } catch (e) {}
  };

  const CompletedComponent = useMemo(
    () => () => {
      return (
        <>
          <div className="w-[80%] min-h-[300px] flex place-items-center m-[0_auto] gap-3">
            <CheckCircledIcon color="green" width={50} height={50} />
            <span>{formCompleteText}</span>
          </div>
        </>
      );
    },
    []
  );

  const MultiStepForm = useMemo(
    () =>
      function ({ children, lastPageNav }: { children: React.ReactNode; lastPageNav?: React.ReactNode }) {
        return (
          <>
            {!submitted && (
              <>
                <form
                  onSubmit={form.onSubmit(
                    (values) => handleSubmit(values),
                    () => {
                      validate();
                    }
                  )}
                >
                  <Stepper
                    active={active}
                    onStepClick={handleNextStep}
                    classNames={{
                      steps: showPagination ? '' : 'hidden',
                    }}
                  >
                    {children}
                  </Stepper>
                  {error && (
                    <Alert
                      variant="light"
                      color="red"
                      title="Submission Error"
                      icon={<InfoCircledIcon />}
                      mt={17}
                      classNames={{
                        message: 'text-[14px]',
                        title: 'text-[16px]',
                      }}
                    >
                      <span dangerouslySetInnerHTML={{ __html: error }} />
                    </Alert>
                  )}
                  {active === stepsCount - 1 && lastPageNav}
                </form>
                {lastPageNav ? active < stepsCount - 1 && <Navigation /> : <Navigation />}
              </>
            )}
            {submitted && <CompletedComponent />}
          </>
        );
      },
    [active, submitted, error, isLoading]
  );

  const getFieldOptions = (field: string, defaultOptions?: Record<string, any>) => {
    if (!params?.fieldOptions?.[field]) {
      return defaultOptions;
    }
    return params.fieldOptions[field];
  };

  return {
    setIsLoading,
    MultiStepForm,
    Navigation,
    validate,
    makeStepIcon,
    nextStep,
    prevStep,
    getFieldOptions,
    form,
    isLoading,
  };
}
