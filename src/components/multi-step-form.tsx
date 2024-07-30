import { Button, Checkbox, Drawer, Group, Stepper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import PhoneInput from "./phone-input";

export default function MultiStepForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [opened, { open, close }] = useDisclosure(false);

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
  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step {...makeStepIcon(1, "Your details")}>
            <TextInput placeholder="Write your First Name" label="First Name" required />
            <TextInput placeholder="Write your Last Name" label="Last Name" required />
            <TextInput
              required
              placeholder="wholesaler@urbanroad.com.au"
              label="Email Address"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PhoneInput placeholder="Phone number" width="100%" required />
          </Stepper.Step>
          <Stepper.Step {...makeStepIcon(2, "Company details")}>Company details</Stepper.Step>
          <Stepper.Step {...makeStepIcon(3, "Other details")}>Other details</Stepper.Step>
          <Stepper.Completed>
            <Button onClick={open}>Open Drawer</Button>
          </Stepper.Completed>
        </Stepper>
      </form>

      <Checkbox defaultChecked label="I consent to receive subscribe to the Urban Road newsletter." />

      <Group justify="space-between" wrap="nowrap" gap={40}>
        <Button p={0} className="shrink-0" variant="transparent" onClick={prevStep} leftSection={<ChevronLeftIcon />}>
          <Text className="underline">Back</Text>
        </Button>
        <Button onClick={nextStep} fullWidth radius="100px" className="h-[48px]">
          Next step
        </Button>
      </Group>
    </>
  );
}
