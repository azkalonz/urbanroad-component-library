import '@mantine/core/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeProvider from './components/theme-provider';
import WholesaleRegistrationForm from './components/wholesale-registraton-form';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <div className="max-w-[423px] m-[0_auto] mt-10">
      <ThemeProvider>
        <WholesaleRegistrationForm
          {...{
            title: 'Wholesale Registration',
            webhookUrl:
              'https://flow.zoho.com.au/7003553082/flow/webhook/incoming?zapikey=1001.c392c5d71ae95043394b820fa9afab8f.f0e2b123143406a67f46cd3b63a7f51f&isdebug=false',
            resetFormDelay: 3,
            formCompleteText: 'Thank you for submitting your wholesale registration form!',
          }}
        />
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
