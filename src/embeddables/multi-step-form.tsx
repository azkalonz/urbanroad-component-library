import WholesaleRegistrationForm from '@/components/wholesale-registration-form';
import ThemeProvider from '@/theme/theme-provider';
import { WholesaleRegistrationFormProps } from '@/types/form';
import ReactDOM from 'react-dom/client';

const multiStepForm = ({
  elementId,
  name,
  options = {},
}: {
  elementId: string;
  name?: string;
  options?: WholesaleRegistrationFormProps;
}) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  root.render(
    <ThemeProvider>{name === 'wholesale-registration' && <WholesaleRegistrationForm {...options} />}</ThemeProvider>
  );
};

(window as any).multiStepForm = multiStepForm;
