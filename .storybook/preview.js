// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme/theme";

export const decorators = [(renderStory) => <MantineProvider theme={theme}>{renderStory()}</MantineProvider>];
