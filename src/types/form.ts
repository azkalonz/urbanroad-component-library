import { UseFormReturnType } from '@mantine/form';

export interface FormProps {
  title?: string;
  fieldOptions?: {
    [key: string]: {
      label?: any;
      placeholder?: string;
    };
  };
  webhookUrl?: string;
  redirectUrl?: string;
  redirectDelay?: number;
  formCompleteText?: string;
  formSubmittingText?: string;
  resetFormDelay?: number;
  errorMessage?: string;
}

export type MultiStepFormBeforeSubmitParams = {
  values: Record<string, any>;
  form: UseFormReturnType<Record<string, any>, (values: Record<string, any>) => Record<string, any>>;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

export interface MultiStepFormProps extends FormProps {
  formData?: any;
  stepErrors?: { [key: number]: { fields: string[] } };
  stepsCount?: number;
  beforeSubmit?: (
    multiStepFormBeforeSubmitParams: MultiStepFormBeforeSubmitParams
  ) => Promise<{ error?: any; isLoading?: boolean; isSubmitted?: boolean; newValues?: any }>;
  showPagination?: boolean;
}

export interface WholesaleRegistrationFormProps extends MultiStepFormProps {
  interestOptions?: string[];
  leadSourceOptions?: string[];
  businessTypeOptions?: string[];
  newsletterCheckboxLabel?: string;
  termsOfTrade?: {
    checkboxLabel?: string;
    popupTitle?: string;
    popupContent?: { title: string; description: any }[];
    buttonLabel?: string;
  };
}
