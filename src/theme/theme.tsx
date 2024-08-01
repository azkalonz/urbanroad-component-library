import {
  Button,
  colorsTuple,
  createTheme,
  DEFAULT_THEME,
  InputWrapper,
  mergeMantineTheme,
  Popover,
  Select,
  TextInput,
} from "@mantine/core";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import "../global.scss";
import "../tailwind.css";
import buttonClasses from "./button.module.scss";
import inputWrapperClasses from "./input-wrapper.module.scss";
import popoverClasses from "./popover.module.scss";
import selectClasses from "./select.module.scss";
import textInputClasses from "./text-input.module.scss";

export const colors = {
  black: "#212121",
};

// TO DO: Variants

const themeOverride = createTheme({
  black: colors.black,
  primaryColor: "light-orange",
  defaultRadius: "4px",
  colors: {
    "light-orange": colorsTuple("#d58967"),
  },
  components: {
    InputWrapper: InputWrapper.extend({
      classNames: {
        ...inputWrapperClasses,
        label: clsx(inputWrapperClasses.label, "text-[14px] leading-[19.6px] mb-[4px]"),
        root: clsx(inputWrapperClasses.root),
        required: clsx(inputWrapperClasses.required),
      },
    }),
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    UnstyledButton: {
      classNames: {
        label: `text-[${colors.black}] uppercase font-[700]`,
      },
    },
    Input: {
      classNames: {
        input: "text-base border border-[#E4E4E4] h-[48px] rounded-[7px]",
      },
    },
    Select: Select.extend({
      defaultProps: {
        rightSection: <ChevronDownIcon />,
      },
      classNames: {
        ...selectClasses,
        dropdown: clsx(selectClasses.dropdown),
        option: clsx(selectClasses.option, "py-2"),
        input: clsx(selectClasses.input, "rounded-t-md"),
        root: clsx(selectClasses.root, "no-margin"),
      },
    }),
    Popover: Popover.extend({
      classNames: {
        ...popoverClasses,
        dropdown: clsx(popoverClasses.dropdown),
      },
    }),
    ActionIcon: {
      classNames: {
        icon: "action-icon",
      },
    },
    TextInput: TextInput.extend({
      classNames: textInputClasses,
    }),
    Stepper: {
      classNames: {
        stepIcon: `stepper-icon w-auto h-auto min-h-0 px-[12px] py-[2px] text-[${colors.black}]`,
        separator: "m-0 w-[20px] h-[1.5px]",
        stepCompletedIcon: `text-[${colors.black}] !duration-0`,
      },
      styles: {
        separator: {
          backgroundColor: "var(--primary-button-color)",
        },
      },
    },
    Checkbox: {
      classNames: {
        label: "text-[14px] leading-[19.6px]",
        body: "items-center",
      },
      styles: {
        inner: {
          "--mantine-color-white": "transparent",
          "--checkbox-size": "24px",
        },
      },
    },
    PillGroup: {
      classNames: {
        group: "w-[100%]",
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
