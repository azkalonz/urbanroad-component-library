import ReactDOM from "react-dom";
import ThemeProvider from "./components/theme-provider";
import WholesaleRegistrationForm from "./components/wholesale-registraton-form";

const multiStepForm = (config: any) => {
  ReactDOM.render(
    <ThemeProvider>
      <WholesaleRegistrationForm {...config} />
    </ThemeProvider>,
    document.getElementById("multi-step-form")
  );
};

export { multiStepForm };
