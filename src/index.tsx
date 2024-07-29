import "@mantine/core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import PhoneInput from "./components/phone-input";
import ThemeProvider from "./components/theme-provider";
import "./tailwind.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <PhoneInput />
    </ThemeProvider>
  </React.StrictMode>
);
