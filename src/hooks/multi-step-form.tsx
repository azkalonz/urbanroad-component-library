import { Button, Group, Stepper, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";

interface MultiStepFormParams {
  formData: any;
  stepErrors?: { [key: number]: { fields: string[] } };
}

export default function useMultiStepForm(params: MultiStepFormParams) {
  const { formData, stepErrors } = params;
  const form = useForm(formData);
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleNextStep = () => {
    const validate = form.validate();
    const { hasErrors, errors } = validate;
    if (stepErrors && stepErrors[active]) {
      let stepHasErrors = Object.keys(errors).some((r: string) => stepErrors[active].fields.includes(r));
      if (!stepHasErrors) {
        nextStep();
      }
    } else {
      if (hasErrors) {
      } else {
        nextStep();
      }
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

  const MultiStepForm = useMemo(
    () =>
      function ({ children }: { children: React.ReactNode }) {
        return (
          <>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <Stepper active={active} onStepClick={setActive}>
                {children}
              </Stepper>
            </form>

            <Group justify="space-between" wrap="nowrap" gap={40} mt="32px">
              {active > 0 && (
                <Button
                  p={0}
                  className="shrink-0"
                  variant="transparent"
                  onClick={prevStep}
                  leftSection={<ChevronLeftIcon />}
                >
                  <Text className="underline ">Back</Text>
                </Button>
              )}
              <Button onClick={handleNextStep} fullWidth radius="100px" className="h-[48px]">
                Next step
              </Button>
            </Group>
          </>
        );
      },
    [active]
  );

  useEffect(() => {
    form.clearErrors();
  }, [active]);

  return {
    MultiStepForm,
    makeStepIcon,
    form,
  };
}
