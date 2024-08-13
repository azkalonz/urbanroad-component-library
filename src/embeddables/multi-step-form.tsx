import WholesaleRegistrationForm from '@/components/wholesale-registraton-form';
import ThemeProvider from '@/theme/theme-provider';
import { MultiStepFormProps } from '@/types/form';
import ReactDOM from 'react-dom/client';

const multiStepForm = ({
  elementId,
  name,
  options = {},
}: {
  elementId: string;
  name?: string;
  options?: MultiStepFormProps;
}) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  root.render(
    <ThemeProvider>{name === 'wholesale-registration' && <WholesaleRegistrationForm {...options} />}</ThemeProvider>
  );
};

(window as any).multiStepForm = multiStepForm;
