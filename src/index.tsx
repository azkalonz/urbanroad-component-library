import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import MultiStepForm from "./components/multi-step-form";
import ThemeProvider from "./components/theme-provider";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div className="max-w-[423px] m-[0_auto] mt-10">
      <ThemeProvider>
        <MultiStepForm />
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
