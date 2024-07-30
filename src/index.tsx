import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./components.scss";
import MultiStepForm from "./components/multi-step-form";
import ThemeProvider from "./components/theme-provider";
import "./tailwind.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div className="max-w-lg m-[0_auto]">
      <ThemeProvider>
        <MultiStepForm />
      </ThemeProvider>
    </div>
  </React.StrictMode>
);
