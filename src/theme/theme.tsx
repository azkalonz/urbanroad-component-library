import buttonClasses from '@/theme/modules/button.module.css';
import inputWrapperClasses from '@/theme/modules/input-wrapper.module.css';
import inputClasses from '@/theme/modules/input.module.css';
import popoverClasses from '@/theme/modules/popover.module.css';
import selectClasses from '@/theme/modules/select.module.css';
import stepperClasses from '@/theme/modules/stepper.module.css';
import textInputClasses from '@/theme/modules/text-input.module.css';
import {
  Button,
  colorsTuple,
  createTheme,
  DEFAULT_THEME,
  Input,
  InputWrapper,
  mergeMantineTheme,
  Popover,
  Select,
  Stepper,
  TextInput,
} from '@mantine/core';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const themeOverride = createTheme({
  primaryColor: 'light-orange',
  defaultRadius: '4px',
  colors: {
    'light-orange': colorsTuple('#d58967'),
  },
  components: {
    InputWrapper: InputWrapper.extend({
      classNames: inputWrapperClasses,
    }),
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    Input: Input.extend({
      classNames: inputClasses,
    }),
    Select: Select.extend({
      defaultProps: {
        rightSection: <ChevronDownIcon />,
      },
      classNames: selectClasses,
    }),
    Popover: Popover.extend({
      classNames: popoverClasses,
    }),
    ActionIcon: {
      classNames: {
        icon: 'action-icon',
      },
    },
    TextInput: TextInput.extend({
      classNames: textInputClasses,
    }),
    Stepper: Stepper.extend({
      classNames: stepperClasses,
    }),
    Checkbox: {
      classNames: {
        label: '!text-[14px] leading-[19.6px]',
        body: 'items-center',
        input: '!w-[24px]',
      },
      styles: {
        inner: {
          '--mantine-color-white': 'transparent',
          '--checkbox-size': '24px',
        },
      },
    },
    Pill: {
      classNames: {
        label: '!text-[14px]',
      },
    },
    PillGroup: {
      classNames: {
        group: 'w-[100%] !text-[14px]',
      },
    },
    PillsInputField: {
      classNames: {
        field: 'focus-visible:shadow-none !text-[14px]',
      },
    },
    TagsInput: {
      classNames: {
        inputField: '!text-[14px] focus-visible:shadow-none',
      },
    },
    Overlay: {
      classNames: {
        root: '!block',
      },
    },
    Drawer: {
      styles: {
        root: {
          '--drawer-size-lg': '620px',
        },
      },
    },
    MultiSelect: {
      classNames: {
        option: '!text-[14px]',
      },
    },
    ScrollArea: {
      classNames: {
        thumb: '!block',
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
