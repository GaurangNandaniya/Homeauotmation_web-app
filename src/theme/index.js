// src/theme/index.js
import { createTheme } from "@mui/material/styles";
import lightPalette from "./palette/light";
import darkPalette from "./palette/dark";
import typography from "./typography";
import shape from "./shape";

export const getTheme = (mode) => {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  return createTheme({
    palette,
    typography,
    shape,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  });
};

export default getTheme;
