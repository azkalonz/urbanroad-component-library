import ArtistSubmissionForm from '@/components/artist-submission-form';
import ThemeProvider from '@/theme/theme-provider';
import { FormProps } from '@/types/form';
import ReactDOM from 'react-dom/client';

const multiStepForm = ({
  elementId,
  name,
  options = {},
}: {
  elementId: string;
  name?: string;
  options?: FormProps;
}) => {
  const root = ReactDOM.createRoot(document.getElementById(elementId) as HTMLElement);
  root.render(<ThemeProvider>{name === 'artist-submission' && <ArtistSubmissionForm {...options} />}</ThemeProvider>);
};

(window as any).multiStepForm = multiStepForm;
