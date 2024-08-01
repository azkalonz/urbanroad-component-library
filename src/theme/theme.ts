import { colorsTuple, createTheme, DEFAULT_THEME, mergeMantineTheme, Popover, Select } from "@mantine/core";
import "../global.scss";
import "../tailwind.css";
import selectClasses from "./select.module.scss";
import popoverClasses from "./popover.module.scss";
import clsx from "clsx";

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
    InputWrapper: {
      classNames: {
        label: "text-[14px] leading-[19.6px] mb-[4px]",
        root: "mb-[8px]",
        required: `text-[${colors.black}]`,
      },
    },
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
      classNames: {
        ...selectClasses,
        dropdown: clsx(selectClasses.dropdown),
        option: clsx(selectClasses.option, "py-2"),
        input: clsx(selectClasses.input, "rounded-t-md"),
      },
    }),
    Popover: Popover.extend({
      classNames: {
        ...popoverClasses,
      },
    }),
    ActionIcon: {
      classNames: {
        icon: "action-icon",
      },
    },
    TextInput: {
      classNames: {
        required: `text-[${colors.black}]`,
      },
    },
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
        label: "text-base",
        body: "items-center",
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
