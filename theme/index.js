import { extendTheme } from "@chakra-ui/react";
import { theme as baseTheme } from "@saas-ui/react";
import { theme as glassTheme } from "@saas-ui/theme-glass";

export const theme = extendTheme(
  {
    ...glassTheme,
    colors: {
      ...glassTheme.colors,
      black: "#0e1012",
      primary: {
        50: "#ebfaf9",
        100: "#acece8",
        200: "#60d8d0",
        300: "#50b5af",
        400: "#48a29c",
        500: "#3d8984",
        600: "#33736f",
        700: "#295d59",
        800: "#234e4b",
        900: "#193836",
      },
    },
  },
  baseTheme
);
