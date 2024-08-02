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
import '@/global.css';
import * as buttonClasses from '@/theme/modules/button.module.css';
import * as inputWrapperClasses from '@/theme/modules/input-wrapper.module.css';
import * as popoverClasses from '@/theme/modules/popover.module.css';
import * as selectClasses from '@/theme/modules/select.module.css';
import * as textInputClasses from '@/theme/modules/text-input.module.css';
import * as inputClasses from '@/theme/modules/input.module.css';
import * as stepperClasses from '@/theme/modules/stepper.module.css';

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
        label: 'text-[14px] leading-[19.6px]',
        body: 'items-center',
      },
      styles: {
        inner: {
          '--mantine-color-white': 'transparent',
          '--checkbox-size': '24px',
        },
      },
    },
    PillGroup: {
      classNames: {
        group: 'w-[100%]',
      },
    },
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
