import ReactDOM from 'react-dom/client';
import ThemeProvider from '@/components/theme-provider';
import WholesaleRegistrationForm from '@/components/wholesale-registraton-form';
import { MultiStepFormProps } from '@/types/form';

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

export { multiStepForm };
