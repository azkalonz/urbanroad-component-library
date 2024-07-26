import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
