import ReactDOM from 'react-dom/client';
import ThemeProvider from '@/components/theme-provider';
import WholesaleRegistrationForm from '@/components/wholesale-registraton-form';

const multiStepForm = ({ elementId, name }: { elementId: string; name?: string }) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  root.render(<ThemeProvider>{name === 'wholesale-registration' && <WholesaleRegistrationForm />}</ThemeProvider>);
};

export { multiStepForm };
