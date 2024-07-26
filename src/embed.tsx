import ReactDOM from "react-dom";
import MultiStepForm from "./components/multi-step-form";
import ThemeProvider from "./components/theme-provider";

const multiStepForm = (config: any) => {
  ReactDOM.render(
    <ThemeProvider>
      <MultiStepForm {...config} />
    </ThemeProvider>,
    document.getElementById("multi-step-form")
  );
};

export { multiStepForm };
