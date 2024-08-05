export interface MultiStepFormProps {
  title?: string;
  fieldOptions?: {
    [key: string]: {
      label?: any;
      placeholder?: string;
    };
  };
  webhookUrl?: string;
  webhookType?: 'POST' | 'GET';
  redirectUrl?: string;
  redirectDelay?: number;
  formCompleteText?: string;
  formSubmittingText?: string;
  interestOptions?: string[];
  leadSourceOptions?: string[];
  businessTypeOptions?: string[];
}
