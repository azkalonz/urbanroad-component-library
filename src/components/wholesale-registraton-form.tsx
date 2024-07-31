import PhoneInput from "@/components/phone-input";
import useMultiStepForm from "@/hooks/multi-step-form";
import { parsePhone } from "@/utils";
import {
  Anchor,
  Button,
  Checkbox,
  Code,
  Drawer,
  Flex,
  Group,
  Select,
  Stepper,
  TagsInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Country, State } from "country-state-city";
import { isValidNumber } from "libphonenumber-js";
import { useEffect, useMemo } from "react";
const { parseAddress } = require("addresser");

export default function WholesaleRegistrationForm() {
  const { MultiStepForm, form, makeStepIcon } = useMultiStepForm(
    {
      initialValues: {
        subscribe_to_newsletter: false,
        subscribe_to_dropshipping: false,
        agree_to_terms_of_trade: false,
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        company_name: "",
        country: "",
        suburb: "",
        state: "",
        address: "",
        postcode: "",
        abn_acn: "",
        business_type: "",
        facebook_url: "",
        instagram_url: "",
        website_url: "",
        lead_source: "",
        interest: [],
        trade_references: [],
      },
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        phone: (value: string) => {
          let { number_code } = parsePhone(value);
          console.log(number_code);
          return isValidNumber(number_code) ? null : "Invalid phone number";
        },
        // required fields
        ...[
          "first_name",
          "last_name",
          "company_name",
          "country",
          "suburb",
          "state",
          "address",
          "postcode",
          "abn_acn",
          "business_type",
          "website_url",
          "lead_source",
          "interest",
          "trade_references",
        ].reduce((p, c) => ({ ...p, [c]: (value: string) => (value?.length ? null : "Required") }), {}),
      },
    },
    {
      0: {
        fields: ["first_name", "last_name", "email", "phone"],
      },
      1: {
        fields: ["company_name", "country", "suburb", "state", "address", "postcode", "abn_acn", "business_type"],
      },
      2: {
        fields: [],
      },
    }
  );
  const [opened, { open, close }] = useDisclosure(false);
  const countries = useMemo(
    () => Country.getAllCountries().sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)),
    []
  );
  const states = useMemo(
    () => [{ name: "-" }].concat(State.getStatesOfCountry(form.getValues().country)),
    [form.getValues().country]
  );
  useEffect(() => {
    let address = form.getValues().address;
    if (address.length) {
      try {
        address = parseAddress(address);
        let state = State.getAllStates().find((q) => q.name === address.stateName);
        address = {
          postcode: address.zipCode,
          suburb: address.placeName,
          state: state?.name,
          country: Country.getCountryByCode(state?.countryCode!)?.isoCode,
        };

        Object.keys(address).forEach((field) => {
          form.setFieldValue(field, address[field]);
        });
      } catch (e) {}
    }
  }, [form.getValues().address]);

  useEffect(() => {
    if (states.length <= 1) {
      form.setFieldValue("state", "-");
    }
  }, [states]);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Form Values">
        <pre>
          <Code>{JSON.stringify(form.getValues(), null, 4)}</Code>
        </pre>
      </Drawer>
      <MultiStepForm>
        <Stepper.Step {...makeStepIcon(1, "Your details")}>
          <TextInput
            {...form.getInputProps("first_name")}
            placeholder="Write your First Name"
            label="First Name"
            required
          />
          <TextInput
            {...form.getInputProps("last_name")}
            placeholder="Write your Last Name"
            label="Last Name"
            required
          />
          <TextInput
            required
            placeholder="wholesaler@urbanroad.com.au"
            label="Email Address"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <PhoneInput {...form.getInputProps("phone")} placeholder="Phone number" width="100%" required />
          <Checkbox
            {...form.getInputProps("subscribe_to_newsletter")}
            checked={form.getValues().subscribe_to_newsletter}
            className="mt-[8px]"
            label="I consent to receive subscribe to the Urban Road newsletter."
          />
        </Stepper.Step>
        <Stepper.Step {...makeStepIcon(2, "Company details")}>
          <TextInput {...form.getInputProps("company_name")} placeholder="Company name" label="Company name" required />
          <TextInput {...form.getInputProps("address")} placeholder="Address" label="Billing Address" required />
          <Flex gap="8px">
            <TextInput {...form.getInputProps("postcode")} placeholder="Postcode" label="Postcode" required w="100%" />
            <TextInput {...form.getInputProps("suburb")} placeholder="Suburb" label="Suburb" required w="100%" />
          </Flex>
          <Flex gap="8px">
            <Select
              {...form.getInputProps("country")}
              label="Country"
              placeholder="Country"
              required
              allowDeselect={false}
              withCheckIcon={false}
              data={countries.map((q) => ({
                value: q.isoCode,
                label: q.name,
              }))}
              key={form.key("country")}
              searchable
              w="100%"
            />
            <Select
              {...form.getInputProps("state")}
              label="State"
              placeholder="State"
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
              key={form.key("state")}
              searchable
              w="100%"
            />
          </Flex>
          <TextInput {...form.getInputProps("abn_acn")} placeholder="ABN / ACN" label="ABN / ACN" required w="100%" />
          <Select
            {...form.getInputProps("business_type")}
            label="Business Type"
            required
            data={[
              "Stockist – Ecommerce",
              "Stockist – Store Front",
              "Interior Designer",
              "Property Stylist",
              "Commercial",
              "Media",
            ]}
            placeholder="Select your Business Type"
            limit={100}
            key={form.key("state")}
            searchable
          />
          <Checkbox
            {...form.getInputProps("subscribe_to_dropshipping")}
            checked={form.getValues().subscribe_to_dropshipping}
            className="mt-[8px]"
            label={
              <>
                <Text>I would like information regarding dropshipping</Text>
                <Text>
                  <small>Our Wholesale manager will be in touch to discuss further</small>
                </Text>
              </>
            }
          />
        </Stepper.Step>
        <Stepper.Step {...makeStepIcon(3, "Other details")}>
          <TextInput
            {...form.getInputProps("facebook_url")}
            placeholder="Facebook"
            label="Facebook URL (optional)"
            w="100%"
          />
          <TextInput
            {...form.getInputProps("instagram_url")}
            placeholder="Instagram"
            label="Instagram URL (optional)"
            w="100%"
          />
          <TextInput
            {...form.getInputProps("website_url")}
            placeholder="yourwebsite.com.au"
            label="Website URL"
            required
            w="100%"
          />
          <Select
            {...form.getInputProps("lead_source")}
            label="How did you hear about us?"
            required
            data={["Google Search"]}
            searchable
          />
          <Checkbox.Group {...form.getInputProps("interest")} label="What products interest you the most?" withAsterisk>
            <Group mt="xs">
              {["Wall Art", "Wallpaper", "Homewares", "Furniture", "Commercial"].map((interest: string) => (
                <Checkbox value={interest} label={interest} key={interest} />
              ))}
            </Group>
          </Checkbox.Group>
          <TagsInput
            {...form.getInputProps("trade_references")}
            maxTags={2}
            label="Trade References"
            required
            placeholder="Please provide two trade references"
            classNames={{
              input: "h-auto min-h-[48px] flex items-center",
            }}
          />
          <Checkbox
            {...form.getInputProps("agree_to_terms_of_trade")}
            checked={form.getValues().agree_to_terms_of_trade}
            className="mt-[8px]"
            label={
              <Text>
                I agree to the Urban Road <Anchor href="#">Terms of Trade</Anchor>
              </Text>
            }
          />
        </Stepper.Step>
        <Stepper.Completed>
          <Button onClick={open}>View Form Values</Button>
        </Stepper.Completed>
      </MultiStepForm>
    </>
  );
}
