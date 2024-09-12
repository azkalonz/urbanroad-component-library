import ArtistSubmissionForm from '@/components/artist-submission-form';
import ContactUsForm from '@/components/contact-us-form';
import CreateDesignServiceRequestForm from '@/components/create-design-service-request';
import ThemeProvider from '@/theme/theme-provider';
import { FormProps } from '@/types/form';
import ReactDOM from 'react-dom/client';

const onePageForm = ({ elementId, name, options = {} }: { elementId: string; name?: string; options?: FormProps }) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  const components = {
    'artist-submission': ArtistSubmissionForm,
    'contact-us': ContactUsForm,
    cdsr: CreateDesignServiceRequestForm,
  };
  const Component = components[name as keyof typeof components];

  root.render(<ThemeProvider>{<Component {...options} />}</ThemeProvider>);
};

(window as any).onePageForm = onePageForm;
