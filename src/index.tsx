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
        <WholesaleRegistrationForm />
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
