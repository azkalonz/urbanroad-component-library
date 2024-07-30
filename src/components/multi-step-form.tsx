import { Button, Drawer, Group, Stepper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
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

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
            <Button type="submit" mt="sm">
              Submit
            </Button>
          </form>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          <Button onClick={open}>Open Drawer</Button>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
