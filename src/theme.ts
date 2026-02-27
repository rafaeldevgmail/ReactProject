import { createTheme, Theme } from "@mui/material";

export const getCustomTheme = (darkMode: boolean): Theme => {
  return createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#6750A4" },
      secondary: { main: "#625B71" },
      background: {
        default: darkMode ? "#1C1B1F" : "#FFFBFE",
        paper: darkMode ? "#2B2930" : "#F3EDF7",
      },
    },
    shape: { borderRadius: 3 },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h4: { fontWeight: 700 },
    },
  });
};
