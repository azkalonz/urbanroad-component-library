import { theme } from '@/theme/theme';
import { MantineProvider } from '@mantine/core';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
