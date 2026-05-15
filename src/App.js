import React, { useReducer, useMemo, useState, useEffect } from "react";
import RootPage from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/googleLogin";
import { reducers, initialValue } from "contextAPI/reduces";
import { AppContext } from "contextAPI/contextAPI";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";

const router = createBrowserRouter([RootPage()]);

const THEME_OVERRIDE_KEY = "ha_theme_override";

const App = () => {
  const [state, dispatch] = useReducer(reducers, initialValue);

  // 'auto' | 'light' | 'dark' — read from localStorage, default 'auto'.
  const [themeOverride, setThemeOverride] = useState(
    () => localStorage.getItem(THEME_OVERRIDE_KEY) || "auto"
  );

  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemPrefersDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const mode = useMemo(() => {
    if (themeOverride === "light") return "light";
    if (themeOverride === "dark") return "dark";
    return systemPrefersDark ? "dark" : "light";
  }, [themeOverride, systemPrefersDark]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const updateThemeOverride = (next) => {
    setThemeOverride(next);
    if (next === "auto") localStorage.removeItem(THEME_OVERRIDE_KEY);
    else localStorage.setItem(THEME_OVERRIDE_KEY, next);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContext.Provider
        value={{ state, dispatch, themeOverride, setThemeOverride: updateThemeOverride }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
          </LocalizationProvider>
        </ThemeProvider>
      </AppContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
