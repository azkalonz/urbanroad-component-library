export interface MultiStepFormProps {
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
  interestOptions?: string[];
  leadSourceOptions?: string[];
  businessTypeOptions?: string[];
  resetFormDelay?: number;
  errorMessage?: string;
  newsletterCheckboxLabel?: string;
  termsOfTrade?: {
    checkboxLabel?: string;
    popupTitle?: string;
    popupContent?: { title: string; description: any }[];
    buttonLabel?: string;
  };
}
