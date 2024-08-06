import { theme } from '@/theme/theme';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@/global.css';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
