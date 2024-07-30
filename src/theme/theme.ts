import { colorsTuple, createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

const themeOverride = createTheme({
  primaryColor: "orange",
  defaultRadius: 0,
  colors: {
    black: colorsTuple("#212121"),
  },
  components: {
    InputWrapper: {
      classNames: {
        label: "text-[14px] leading-[19.6px] mb-[4px]",
        root: "mb-[8px]",
      },
    },
    Input: {
      classNames: {
        input: "text-base border border-[#E4E4E4] h-[48px] rounded-[7px]",
      },
    },
    Select: {
      classNames: {
        option: "text-base",
      },
    },
    ActionIcon: {
      classNames: {
        icon: "action-icon",
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
