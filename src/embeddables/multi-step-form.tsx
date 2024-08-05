import ReactDOM from 'react-dom/client';
import ThemeProvider from '@/components/theme-provider';
import WholesaleRegistrationForm from '@/components/wholesale-registraton-form';
import { MultiStepFormProps } from '@/types/form';

const multiStepForm = ({
  elementId,
  name,
  parameters = {},
}: {
  elementId: string;
  name?: string;
  parameters?: MultiStepFormProps;
}) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  root.render(
    <ThemeProvider>{name === 'wholesale-registration' && <WholesaleRegistrationForm {...parameters} />}</ThemeProvider>
  );
};

export { multiStepForm };
