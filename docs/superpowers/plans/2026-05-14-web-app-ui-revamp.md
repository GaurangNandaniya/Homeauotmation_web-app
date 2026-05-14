# Web App UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing ad-hoc styling of `Homeauotmation_web-app` with a Material You-themed, mobile-first responsive UI. Surface device types, add optimistic toggle feedback, simplify navigation chrome — no routing or backend rewrite.

**Architecture:** Custom MUI 5 theme (Purple seed, auto light/dark following system + override), new shared components in `src/commonComponents/`, in-place page-by-page JSX swap. No new routes, no new dependencies. Backend touched only to ensure `switch.type` flows through `/switch/create` and `/switch/update`.

**Tech Stack:** React 18, MUI 5 (`@mui/material`, `@mui/icons-material`), react-router-dom v6, webpack 5, sass (existing, mostly retired), `@react-oauth/google`, lodash, dayjs (existing).

**Testing approach:** The project has no test suite. Each task ends with a **manual verification step** — load the relevant page in `npm start`, click through specified flows, confirm visual/behavior. The last task is a full responsive + theme matrix run.

**Reference spec:** `docs/superpowers/specs/2026-05-14-web-app-ui-revamp-design.md`

---

## File Structure

### New files

```
src/
  theme/                              NEW directory — MUI theme system
    palette/light.js
    palette/dark.js
    typography.js
    shape.js
    index.js                          getTheme(mode) factory
  constants/
    deviceTypes.js                    NEW — device type list + icon mapping
  commonComponents/
    TopBar/                           NEW — back / title / settings header
      TopBar.js
      index.js
    SwitchTile/                       NEW — replaces old SwitchCard
      SwitchTile.js
      index.js
    HomeCard/                         NEW — home grid card
      HomeCard.js
      index.js
    RoomCard/                         NEW — room grid card
      RoomCard.js
      index.js
    SkeletonTile/                     NEW — animated loading placeholder
      SkeletonTile.js
      index.js
    SettingsSheet/                    NEW — bottom sheet / dropdown
      SettingsSheet.js
      index.js
    DeviceTypePicker/                 NEW — type chips inside create/edit modal
      DeviceTypePicker.js
      index.js
```

### Modified files

```
src/
  App.js                              wrap with ThemeProvider + theme-mode state
  commonComponents/index.js           re-export new components
  routes/components/RootPage.js       strip AppBar/greeting/logout (moved to SettingsSheet)
  routes/routes/Login/components/Login.js                          rebuild hero layout
  routes/routes/SignUp/components/SignUp.js                        align with Login
  routes/routes/UserHomes/components/UserHomes.js                  use TopBar + HomeCard + SwitchTile
  routes/routes/UserHomes/routes/HomeDetails/components/HomeDetails.js  use TopBar + RoomCard
  routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/RoomDetails.js
                                      use TopBar + SwitchTile grid + "All off"
  routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/CreateEditModal/CreateEditModal.js
                                      add DeviceTypePicker
```

### Deleted files

```
src/commonComponents/BreadCrumbs/     replaced by TopBar back button
src/commonComponents/Loader/          replaced by SkeletonTile grids
src/routes/routes/UserHomes/components/SwitchCard/  (old) replaced by SwitchTile
src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/SwitchCard/  (old) replaced by SwitchTile
```

### Backend (`Homeautomation_lamda_REST_API`)

```
src/controllers/switchController.js   verify type accepted in create/update
src/models/Switch.js                  verify type insertable/updatable
src/db/migrations/20260514_009_backfill_switch_type.js   NEW — backfill default
```

---

## Conventions used in this plan

- **No test step in tasks** because there is no test runner. Replace with **Verify** = manual UI check.
- **Commit messages** follow existing repo style: `<type>: <description>` (e.g., `feat:`, `refactor:`, `chore:`).
- **Path aliases**: `commonComponents`, `hooks`, `constants/*`, `contextAPI/*`, `HOCs`, `utils/*` are configured in `jsconfig.json`. Components in `src/commonComponents/` import each other via `commonComponents`. Theme imports via relative path (no alias).
- **Styling**: new components use MUI `sx` prop and `styled()`. No new SCSS files. Old SCSS files referenced by deleted components get deleted with them.
- **Re-export**: every new component in `src/commonComponents/` must be added to `src/commonComponents/index.js` (Task 13).
- **Material You container colors** (`primaryContainer`, `onPrimaryContainer`, `surfaceContainer`) are added as custom fields on `theme.palette`. Access via `theme.palette.primaryContainer`.

---

## Phase 1 — Theme foundation

Goal: a working MUI theme that switches between light and dark via system preference (or user override). No visual change to existing pages yet — they'll keep working with the new theme silently.

### Task 1: Light palette

**Files:**
- Create: `src/theme/palette/light.js`

- [ ] **Step 1: Create the light palette file**

```js
// src/theme/palette/light.js
// Material You palette derived from the Purple seed (#6750a4).
// Standard MUI fields + custom container fields for M3-style tints.

const lightPalette = {
  mode: "light",
  primary: {
    main: "#6750a4",
    contrastText: "#ffffff",
    light: "#9a82db",
    dark: "#381e72",
  },
  secondary: {
    main: "#625b71",
    contrastText: "#ffffff",
  },
  error: {
    main: "#ba1a1a",
    contrastText: "#ffffff",
  },
  background: {
    default: "#fef7ff",
    paper: "#fef7ff",
  },
  text: {
    primary: "#1d1b20",
    secondary: "#49454f",
  },
  divider: "#cac4d0",
  // Custom Material You container tokens
  primaryContainer: "#e8def8",
  onPrimaryContainer: "#21005d",
  surfaceContainer: "#f3edf7",
  surfaceContainerHigh: "#ece6f0",
  outline: "#79747e",
};

export default lightPalette;
```

- [ ] **Step 2: Verify file present**

Run: `ls src/theme/palette/light.js`
Expected: file listed.

- [ ] **Step 3: Commit**

```bash
git add src/theme/palette/light.js
git commit -m "feat: add light palette (Material You purple seed)"
```

---

### Task 2: Dark palette

**Files:**
- Create: `src/theme/palette/dark.js`

- [ ] **Step 1: Create the dark palette file**

```js
// src/theme/palette/dark.js
// Material You dark palette from the same Purple seed (#6750a4).

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#d0bcff",
    contrastText: "#381e72",
    light: "#eaddff",
    dark: "#9a82db",
  },
  secondary: {
    main: "#ccc2dc",
    contrastText: "#332d41",
  },
  error: {
    main: "#ffb4ab",
    contrastText: "#690005",
  },
  background: {
    default: "#141218",
    paper: "#1d1b20",
  },
  text: {
    primary: "#e6e0e9",
    secondary: "#cac4d0",
  },
  divider: "#49454f",
  primaryContainer: "#4f378b",
  onPrimaryContainer: "#eaddff",
  surfaceContainer: "#211f26",
  surfaceContainerHigh: "#2b2930",
  outline: "#938f99",
};

export default darkPalette;
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/palette/dark.js
git commit -m "feat: add dark palette"
```

---

### Task 3: Typography and shape

**Files:**
- Create: `src/theme/typography.js`
- Create: `src/theme/shape.js`

- [ ] **Step 1: Create typography overrides**

```js
// src/theme/typography.js
// Minimal overrides on top of MUI default Roboto.

const typography = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: { fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em" },
  h2: { fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" },
  h3: { fontSize: 20, fontWeight: 600 },
  h4: { fontSize: 18, fontWeight: 600 },
  body1: { fontSize: 14, fontWeight: 400 },
  body2: { fontSize: 13, fontWeight: 400 },
  caption: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  button: { textTransform: "none", fontWeight: 600 },
};

export default typography;
```

- [ ] **Step 2: Create shape overrides**

```js
// src/theme/shape.js
const shape = {
  borderRadius: 16,
};

export default shape;
```

- [ ] **Step 3: Commit**

```bash
git add src/theme/typography.js src/theme/shape.js
git commit -m "feat: add theme typography and shape overrides"
```

---

### Task 4: Theme factory

**Files:**
- Create: `src/theme/index.js`

- [ ] **Step 1: Create the factory**

```js
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
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/index.js
git commit -m "feat: theme factory getTheme(mode)"
```

---

### Task 5: Wire ThemeProvider into App.js

**Files:**
- Modify: `src/App.js`

- [ ] **Step 1: Replace App.js with the themed wrapper**

```js
// src/App.js
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
```

- [ ] **Step 2: Verify the app still boots**

Run: `npm start`
Open `http://localhost:8080` (or whichever port webpack-dev-server picks).
Expected: existing pages render. Background may shift slightly (now `#fef7ff`/`#141218` instead of pure white/black depending on system theme). No errors in console.

- [ ] **Step 3: Verify theme override is exposed via context**

In the browser console run:
```js
localStorage.setItem("ha_theme_override", "dark"); location.reload();
```
Expected: app reloads in dark mode (text light, background dark).
Then:
```js
localStorage.removeItem("ha_theme_override"); location.reload();
```
Expected: app reverts to system preference.

- [ ] **Step 4: Commit**

```bash
git add src/App.js
git commit -m "feat: wire ThemeProvider with auto/light/dark mode"
```

---

## Phase 2 — Common components

Each component is a standalone, testable unit. Build all before swapping pages over.

### Task 6: Device-type constants

**Files:**
- Create: `src/constants/deviceTypes.js`

- [ ] **Step 1: Create constants**

```js
// src/constants/deviceTypes.js
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ToysRoundedIcon from "@mui/icons-material/ToysRounded";
import ElectricalServicesRoundedIcon from "@mui/icons-material/ElectricalServicesRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

export const DEVICE_TYPES = [
  { value: "light", label: "Light", iconOn: LightbulbRoundedIcon, iconOff: LightbulbOutlinedIcon },
  { value: "fan", label: "Fan", iconOn: ToysRoundedIcon, iconOff: ToysRoundedIcon },
  { value: "plug", label: "Plug", iconOn: ElectricalServicesRoundedIcon, iconOff: ElectricalServicesRoundedIcon },
  { value: "ac", label: "AC", iconOn: AcUnitRoundedIcon, iconOff: AcUnitRoundedIcon },
  { value: "generic", label: "Generic", iconOn: BoltRoundedIcon, iconOff: BoltRoundedIcon },
];

export const DEFAULT_DEVICE_TYPE = "light";

export const getDeviceType = (value) =>
  DEVICE_TYPES.find((t) => t.value === value) ||
  DEVICE_TYPES.find((t) => t.value === DEFAULT_DEVICE_TYPE);
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/deviceTypes.js
git commit -m "feat: device type registry (light/fan/plug/ac/generic)"
```

---

### Task 7: TopBar component

**Files:**
- Create: `src/commonComponents/TopBar/TopBar.js`
- Create: `src/commonComponents/TopBar/index.js`

- [ ] **Step 1: Implement TopBar**

```js
// src/commonComponents/TopBar/TopBar.js
import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBack, Settings } from "@mui/icons-material";

const TopBar = ({ title, showBack = true, onBackClick, onSettingsClick }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1,
        bgcolor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      {showBack ? (
        <IconButton
          onClick={onBackClick}
          sx={{
            bgcolor: theme.palette.primaryContainer,
            color: theme.palette.onPrimaryContainer,
            width: 36,
            height: 36,
            "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
          }}
          aria-label="Back"
        >
          <ArrowBack fontSize="small" />
        </IconButton>
      ) : (
        <Box sx={{ width: 36 }} />
      )}
      <Typography
        variant="h3"
        sx={{ flex: 1, fontSize: 18, fontWeight: 600 }}
        noWrap
      >
        {title}
      </Typography>
      {onSettingsClick && (
        <IconButton
          onClick={onSettingsClick}
          sx={{ color: theme.palette.text.primary, width: 36, height: 36 }}
          aria-label="Settings"
        >
          <Settings fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default TopBar;
```

- [ ] **Step 2: Create barrel export**

```js
// src/commonComponents/TopBar/index.js
export { default } from "./TopBar";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/TopBar
git commit -m "feat: TopBar component (back + title + settings)"
```

---

### Task 8: SkeletonTile component

**Files:**
- Create: `src/commonComponents/SkeletonTile/SkeletonTile.js`
- Create: `src/commonComponents/SkeletonTile/index.js`

- [ ] **Step 1: Implement SkeletonTile**

```js
// src/commonComponents/SkeletonTile/SkeletonTile.js
import React from "react";
import { Skeleton, Box } from "@mui/material";

// Single tile-shaped skeleton placeholder.
const SkeletonTile = ({ height = 100, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ minHeight: height }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={height}
            sx={{ borderRadius: 4 }}
          />
        </Box>
      ))}
    </>
  );
};

// Convenience: render a grid of skeleton tiles to match a real grid.
export const SkeletonTileGrid = ({ count = 6 }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: 1,
    }}
  >
    <SkeletonTile count={count} />
  </Box>
);

export default SkeletonTile;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/SkeletonTile/index.js
export { default, SkeletonTileGrid } from "./SkeletonTile";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/SkeletonTile
git commit -m "feat: SkeletonTile + SkeletonTileGrid for loading states"
```

---

### Task 9: SwitchTile component

**Files:**
- Create: `src/commonComponents/SwitchTile/SwitchTile.js`
- Create: `src/commonComponents/SwitchTile/index.js`

- [ ] **Step 1: Implement SwitchTile with hybrid optimistic toggle**

```js
// src/commonComponents/SwitchTile/SwitchTile.js
import React, { useState, useCallback } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  StarRounded,
  StarBorderRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import { DropDownMenu } from "commonComponents";
import { getDeviceType } from "constants/deviceTypes";

const CARD_OPTIONS = [
  { id: "rename", label: "Rename", value: "rename" },
  { id: "delete", label: "Delete", value: "delete" },
];

const SwitchTile = ({
  switchData,
  isFavorite = false,
  showOptions = true,
  showFavorite = true,
  onToggle, // async ({ id, state }) => void   — throws on failure to trigger revert
  onFavoriteToggle, // async ({ id, isFavorite }) => void
  onOptionClick, // ({ id, switchData }) => void
}) => {
  const theme = useTheme();
  const { id, name, state: initialState, type } = switchData;
  const deviceType = getDeviceType(type);

  const [localState, setLocalState] = useState(initialState);
  const [isSyncing, setIsSyncing] = useState(false);
  const [favSyncing, setFavSyncing] = useState(false);

  const isOn = localState === "ON";
  const Icon = isOn ? deviceType.iconOn : deviceType.iconOff;

  const handleClick = useCallback(async () => {
    if (isSyncing || !onToggle) return;
    const nextState = isOn ? "OFF" : "ON";
    setLocalState(nextState);
    setIsSyncing(true);
    try {
      await onToggle({ id, state: nextState });
    } catch (e) {
      setLocalState(initialState); // revert on failure
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, isOn, onToggle, id, initialState]);

  const handleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();
      if (favSyncing || !onFavoriteToggle) return;
      setFavSyncing(true);
      try {
        await onFavoriteToggle({ id, isFavorite });
      } finally {
        setFavSyncing(false);
      }
    },
    [favSyncing, onFavoriteToggle, id, isFavorite]
  );

  const handleOption = (params) => {
    if (onOptionClick) onOptionClick({ ...params, switchData });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        bgcolor: isOn ? "primary.main" : theme.palette.primaryContainer,
        color: isOn ? "primary.contrastText" : theme.palette.onPrimaryContainer,
        borderRadius: 4,
        p: 1.5,
        cursor: isSyncing ? "wait" : "pointer",
        opacity: isSyncing ? 0.55 : 1,
        pointerEvents: isSyncing ? "none" : "auto",
        transition:
          "opacity 0.18s ease, background-color 0.18s ease, color 0.18s ease",
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Icon sx={{ fontSize: 24 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          {showFavorite && (
            <IconButton
              size="small"
              onClick={handleFavorite}
              sx={{ color: "inherit", opacity: favSyncing ? 0.4 : 1 }}
              aria-label={isFavorite ? "Unfavorite" : "Favorite"}
            >
              {isFavorite ? (
                <StarRounded fontSize="small" />
              ) : (
                <StarBorderRounded fontSize="small" />
              )}
            </IconButton>
          )}
          {showOptions && (
            <DropDownMenu options={CARD_OPTIONS} onOptionClick={handleOption}>
              <IconButton
                size="small"
                onClick={(e) => e.stopPropagation()}
                sx={{ color: "inherit" }}
                aria-label="More"
              >
                <MoreVertRounded fontSize="small" />
              </IconButton>
            </DropDownMenu>
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
          {name}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            mt: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: isOn ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {isOn ? "ON" : "OFF"}
        </Box>
      </Box>
    </Box>
  );
};

export default SwitchTile;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/SwitchTile/index.js
export { default } from "./SwitchTile";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/SwitchTile
git commit -m "feat: SwitchTile w/ hybrid optimistic toggle"
```

---

### Task 10: HomeCard component

**Files:**
- Create: `src/commonComponents/HomeCard/HomeCard.js`
- Create: `src/commonComponents/HomeCard/index.js`

- [ ] **Step 1: Implement HomeCard**

```js
// src/commonComponents/HomeCard/HomeCard.js
import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { HomeRounded, MoreVertRounded } from "@mui/icons-material";
import { DropDownMenu } from "commonComponents";

const CARD_OPTIONS = [
  { id: "rename", label: "Rename", value: "rename" },
  { id: "delete", label: "Delete", value: "delete" },
];

const HomeCard = ({ home, onClick, onOptionClick, showOptions = true }) => {
  const theme = useTheme();
  const {
    id,
    name,
    room_count = 0,
    active_switch_count = 0,
    total_switch_count = 0,
  } = home;

  const summary =
    total_switch_count > 0
      ? `${active_switch_count} of ${total_switch_count} switches on`
      : `${room_count} room${room_count === 1 ? "" : "s"}`;

  const handleOption = (params) => {
    if (onOptionClick) onOptionClick({ ...params, home });
  };

  return (
    <Box
      onClick={() => onClick({ id })}
      sx={{
        bgcolor: theme.palette.surfaceContainer,
        color: theme.palette.text.primary,
        borderRadius: 4,
        p: 2,
        cursor: "pointer",
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "background-color 0.18s ease",
        "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <HomeRounded sx={{ fontSize: 24, color: "primary.main" }} />
        {showOptions && (
          <DropDownMenu options={CARD_OPTIONS} onOptionClick={handleOption}>
            <IconButton
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{ color: "inherit" }}
              aria-label="More"
            >
              <MoreVertRounded fontSize="small" />
            </IconButton>
          </DropDownMenu>
        )}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }} noWrap>
          {name}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "none", letterSpacing: 0 }}>
          {summary}
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeCard;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/HomeCard/index.js
export { default } from "./HomeCard";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/HomeCard
git commit -m "feat: HomeCard with activity summary"
```

---

### Task 11: RoomCard component

**Files:**
- Create: `src/commonComponents/RoomCard/RoomCard.js`
- Create: `src/commonComponents/RoomCard/index.js`

- [ ] **Step 1: Implement RoomCard**

```js
// src/commonComponents/RoomCard/RoomCard.js
import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { MeetingRoomRounded, MoreVertRounded } from "@mui/icons-material";
import { DropDownMenu } from "commonComponents";

const CARD_OPTIONS = [
  { id: "rename", label: "Rename", value: "rename" },
  { id: "delete", label: "Delete", value: "delete" },
];

const RoomCard = ({ room, onClick, onOptionClick, showOptions = true }) => {
  const theme = useTheme();
  const {
    id,
    name,
    active_switch_count = 0,
    total_switch_count = 0,
  } = room;

  const summary = `${active_switch_count} of ${total_switch_count} on`;

  const handleOption = (params) => {
    if (onOptionClick) onOptionClick({ ...params, room });
  };

  return (
    <Box
      onClick={() => onClick({ id })}
      sx={{
        bgcolor: theme.palette.surfaceContainer,
        color: theme.palette.text.primary,
        borderRadius: 4,
        p: 2,
        cursor: "pointer",
        minHeight: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "background-color 0.18s ease",
        "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <MeetingRoomRounded sx={{ fontSize: 22, color: "primary.main" }} />
        {showOptions && (
          <DropDownMenu options={CARD_OPTIONS} onOptionClick={handleOption}>
            <IconButton
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{ color: "inherit" }}
              aria-label="More"
            >
              <MoreVertRounded fontSize="small" />
            </IconButton>
          </DropDownMenu>
        )}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }} noWrap>
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", textTransform: "none", letterSpacing: 0 }}
        >
          {summary}
        </Typography>
      </Box>
    </Box>
  );
};

export default RoomCard;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/RoomCard/index.js
export { default } from "./RoomCard";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/RoomCard
git commit -m "feat: RoomCard"
```

---

### Task 12: SettingsSheet component

**Files:**
- Create: `src/commonComponents/SettingsSheet/SettingsSheet.js`
- Create: `src/commonComponents/SettingsSheet/index.js`

- [ ] **Step 1: Implement SettingsSheet**

```js
// src/commonComponents/SettingsSheet/SettingsSheet.js
import React, { useContext } from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { LogoutRounded } from "@mui/icons-material";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";

const THEMES = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const APP_VERSION = "1.0.0";

const SettingsSheet = ({ open, onClose, onLogout }) => {
  const theme = useTheme();
  const { state, themeOverride, setThemeOverride } = useContext(AppContext);
  const displayName = _.get(state, "userInfo.firstName", "User");

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          bgcolor: theme.palette.background.paper,
          p: 2,
          maxWidth: 560,
          mx: "auto",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: theme.palette.divider,
            }}
          />
        </Box>
        <Typography variant="h3">Settings</Typography>

        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 1, color: "text.secondary" }}
          >
            Theme
          </Typography>
          <ToggleButtonGroup
            value={themeOverride}
            exclusive
            onChange={(e, val) => val && setThemeOverride(val)}
            size="small"
            sx={{ width: "100%" }}
          >
            {THEMES.map((t) => (
              <ToggleButton
                key={t.value}
                value={t.value}
                sx={{ flex: 1, borderRadius: 999, textTransform: "none" }}
              >
                {t.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, color: "text.secondary" }}
          >
            Signed in as
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
        </Box>

        <Divider />

        <Box
          onClick={onLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: "error.main",
            py: 1,
          }}
        >
          <LogoutRounded fontSize="small" />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Logout
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{ textAlign: "center", color: "text.secondary", letterSpacing: 0, textTransform: "none" }}
        >
          v{APP_VERSION}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SettingsSheet;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/SettingsSheet/index.js
export { default } from "./SettingsSheet";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/SettingsSheet
git commit -m "feat: SettingsSheet (theme override + logout)"
```

---

### Task 13: DeviceTypePicker component

**Files:**
- Create: `src/commonComponents/DeviceTypePicker/DeviceTypePicker.js`
- Create: `src/commonComponents/DeviceTypePicker/index.js`

- [ ] **Step 1: Implement DeviceTypePicker**

```js
// src/commonComponents/DeviceTypePicker/DeviceTypePicker.js
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DEVICE_TYPES } from "constants/deviceTypes";

const DeviceTypePicker = ({ value, onChange, label = "Type" }) => {
  const theme = useTheme();
  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 0.75, color: "text.secondary" }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(74px, 1fr))",
          gap: 1,
        }}
      >
        {DEVICE_TYPES.map((t) => {
          const Icon = t.iconOn;
          const selected = t.value === value;
          return (
            <Box
              key={t.value}
              onClick={() => onChange(t.value)}
              sx={{
                bgcolor: selected
                  ? theme.palette.primary.main
                  : theme.palette.primaryContainer,
                color: selected
                  ? theme.palette.primary.contrastText
                  : theme.palette.onPrimaryContainer,
                borderRadius: 3,
                p: 1,
                cursor: "pointer",
                textAlign: "center",
                transition: "background-color 0.15s ease, color 0.15s ease",
                minHeight: 70,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.25,
              }}
            >
              <Icon fontSize="small" />
              <Typography
                variant="caption"
                sx={{ textTransform: "none", letterSpacing: 0, fontSize: 11 }}
              >
                {t.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default DeviceTypePicker;
```

- [ ] **Step 2: Barrel export**

```js
// src/commonComponents/DeviceTypePicker/index.js
export { default } from "./DeviceTypePicker";
```

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/DeviceTypePicker
git commit -m "feat: DeviceTypePicker chips"
```

---

### Task 14: Re-export new components

**Files:**
- Modify: `src/commonComponents/index.js`

- [ ] **Step 1: Add new exports**

```js
// src/commonComponents/index.js
import GoogleLoginWrapper from "./GoogleLoginWrapper";
import FullScreenLoader from "./FullScreenLoader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Modal from "./Modal";
import DropDownMenu from "./DropDownMenu";
import DialogModal from "./DialogModal";
import Button from "./Button";
import BreadCrumbs from "./BreadCrumbs";
import TopBar from "./TopBar";
import SwitchTile from "./SwitchTile";
import HomeCard from "./HomeCard";
import RoomCard from "./RoomCard";
import SkeletonTile, { SkeletonTileGrid } from "./SkeletonTile";
import SettingsSheet from "./SettingsSheet";
import DeviceTypePicker from "./DeviceTypePicker";

export {
  GoogleLoginWrapper,
  FullScreenLoader,
  EmptyState,
  Loader,
  Modal,
  DropDownMenu,
  DialogModal,
  Button,
  BreadCrumbs,
  TopBar,
  SwitchTile,
  HomeCard,
  RoomCard,
  SkeletonTile,
  SkeletonTileGrid,
  SettingsSheet,
  DeviceTypePicker,
};
```

- [ ] **Step 2: Verify import works**

Run: `npm start`
Expected: no compilation errors. (Existing pages still render unchanged since none use the new components yet.)

- [ ] **Step 3: Commit**

```bash
git add src/commonComponents/index.js
git commit -m "chore: re-export new common components"
```

---

## Phase 3 — Page migration

Now we wire the new components into pages. After each task the app remains fully usable.

### Task 15: RootPage — strip AppBar, host SettingsSheet

**Files:**
- Modify: `src/routes/components/RootPage.js`

- [ ] **Step 1: Replace RootPage.js**

```js
// src/routes/components/RootPage.js
import React, { useEffect, useContext, useState } from "react";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, setUserInfo } from "utils/localStorageUtils";
import { isJWTExpired } from "utils/jwtUtils";
import _ from "lodash";
import { AppContext } from "contextAPI/contextAPI";
import {
  HIDE_TOASTER,
  UPDATE_ROUTE_INFO,
  UPDATE_USER_INFO,
} from "contextAPI/reducerActions";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { LoginHelpersHOC } from "HOCs";
import { Button, FullScreenLoader, SettingsSheet } from "commonComponents";

const RootPage = (props) => {
  const { logoutUser } = props;
  const childComp = useOutlet({ openSettings: () => setSettingsOpen(true) });
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { state, dispatch } = useContext(AppContext);
  const { toaster } = state;
  const { isOpen, severity, toasterStyle, autoHideDuration, message } = toaster;

  const isLoggedIn = _.get(state, "userInfo.isLoggedIn", false);

  useEffect(() => {
    const userInfo = getUserInfo();
    const routes = _.filter(
      _.split(pathname, "/"),
      (item) => !_.isEmpty(item) && !_.includes(["signup", "login"], item)
    );

    if (userInfo && userInfo.token && !isJWTExpired(userInfo.token)) {
      dispatch({
        type: UPDATE_USER_INFO,
        value: { ...userInfo, isLoggedIn: true },
      });
      const routeBeforeLogin = _.get(state, "routeInfo.routeBeforeLogin", "");
      if (!_.isEmpty(routeBeforeLogin)) {
        navigate(routeBeforeLogin);
      } else if (_.size(routes) == 0) {
        navigate("/userHomes");
      }
    } else {
      setUserInfo({ userInfo: {} });
      if (_.size(routes) > 0) {
        if (!_.get(state, "routeInfo.isRouteBeforeLoginAdded", false)) {
          dispatch({
            type: UPDATE_ROUTE_INFO,
            value: { routeBeforeLogin: pathname, isRouteBeforeLoginAdded: true },
          });
        }
        navigate("/login");
      }
    }
  }, [pathname]);

  const onCloseToaster = () => dispatch({ type: HIDE_TOASTER });

  const onLogoutUser = async () => {
    setSettingsOpen(false);
    setIsLoading(true);
    await logoutUser();
    setIsLoading(false);
  };

  const onSignupClick = () => navigate("/signup");
  const onLoginClick = () => navigate("/login");

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {childComp ? (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {childComp}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
              gap: 4,
              maxWidth: 480,
              mx: "auto",
              width: "100%",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h1" sx={{ mb: 1 }}>
                Home-Automation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Control every switch from one place.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%", maxWidth: 320 }}>
              <Button onClick={onLoginClick} variant="contained" size="large" fullWidth>
                Login
              </Button>
              <Button onClick={onSignupClick} variant="outlined" size="large" fullWidth>
                Sign up
              </Button>
            </Box>
          </Box>
        )}

        <SettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onLogout={onLogoutUser}
        />

        <Snackbar open={isOpen} autoHideDuration={autoHideDuration} onClose={onCloseToaster}>
          <Alert onClose={onCloseToaster} severity={severity} sx={toasterStyle}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
      {isLoading && <FullScreenLoader />}
    </>
  );
};

export default LoginHelpersHOC(RootPage);
```

- [ ] **Step 2: Verify the app boots**

Run: `npm start`. Without being logged in you should see the new centered hero ("Home-Automation" + subtitle + Login/Sign up buttons). When logged in, the old greeting/AppBar bar is gone — each page will be responsible for its own TopBar (next tasks).

- [ ] **Step 3: Commit**

```bash
git add src/routes/components/RootPage.js
git commit -m "refactor: RootPage hosts SettingsSheet; AppBar removed"
```

---

### Task 16: Login page revamp

**Files:**
- Modify: `src/routes/routes/Login/components/Login.js`

- [ ] **Step 1: Open the current Login.js to keep its data-flow intact**

Run: `cat src/routes/routes/Login/components/Login.js`
Note the exports, props, and handlers. We will keep those.

- [ ] **Step 2: Replace Login.js with the new layout**

```js
// src/routes/routes/Login/components/Login.js
import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button, GoogleLoginWrapper, FullScreenLoader } from "commonComponents";
import { LoginHelpersHOC } from "HOCs";
import _ from "lodash";

const Login = (props) => {
  const { onLoginViaGoogle, onLoginViaEmail } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogle = async (credential) => {
    setIsLoading(true);
    await onLoginViaGoogle(credential);
    setIsLoading(false);
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          gap: 4,
          maxWidth: 480,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h1" sx={{ mb: 1 }}>
            Home-Automation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to control your switches.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <GoogleLoginWrapper onLogin={handleGoogle} />
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0, textTransform: "none" }}>
              New here?{" "}
              <Box
                component="span"
                onClick={() => navigate("/signup")}
                sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
              >
                Create an account
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && <FullScreenLoader />}
    </>
  );
};

const route = () => ({
  path: "login",
  element: <LoginHelpersHOC(Login) />,
});

export default Login;
```

> **Note:** if the existing Login uses different prop names (e.g., `loginViaGoogle`), match them. The handler signatures stay the same — only the layout changes.

- [ ] **Step 3: Verify**

Run: `npm start`. Navigate to `/login`. Expected: centered hero, "Continue with Google" via the existing `GoogleLoginWrapper`, "Create an account" link below.

- [ ] **Step 4: Commit**

```bash
git add src/routes/routes/Login/components/Login.js
git commit -m "feat: Login page hero layout"
```

---

### Task 17: SignUp page revamp

**Files:**
- Modify: `src/routes/routes/SignUp/components/SignUp.js`

- [ ] **Step 1: Read existing SignUp.js to preserve handlers**

Run: `cat src/routes/routes/SignUp/components/SignUp.js`. Note prop names.

- [ ] **Step 2: Replace with new layout matching Login**

```js
// src/routes/routes/SignUp/components/SignUp.js
import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button, FullScreenLoader } from "commonComponents";

const SignUp = (props) => {
  const { onSignup } = props; // adjust if existing prop is named differently
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSignup({ firstName, lastName, email, password });
    setIsLoading(false);
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          py: 4,
          gap: 3,
          maxWidth: 480,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h1" sx={{ mb: 1 }}>
            Create account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            One account, all your homes.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="contained" size="large" onClick={handleSubmit} fullWidth>
            Sign up
          </Button>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0, textTransform: "none" }}>
              Already have an account?{" "}
              <Box
                component="span"
                onClick={() => navigate("/login")}
                sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }}
              >
                Log in
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && <FullScreenLoader />}
    </>
  );
};

export default SignUp;
```

> **Note:** preserve the existing route wrapping (`SignUpRoute()` or similar) — only the inner component changes.

- [ ] **Step 3: Verify**

Run: `npm start`. Navigate to `/signup`. Expected: centered form, "Sign up" button, "Log in" link.

- [ ] **Step 4: Commit**

```bash
git add src/routes/routes/SignUp/components/SignUp.js
git commit -m "feat: SignUp page layout"
```

---

### Task 18: UserHomes route revamp

**Files:**
- Modify: `src/routes/routes/UserHomes/components/UserHomes.js`
- Delete (later, in Task 24): `src/routes/routes/UserHomes/components/SwitchCard/`

- [ ] **Step 1: Replace UserHomes.js**

```js
// src/routes/routes/UserHomes/components/UserHomes.js
import React, { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useFetchData } from "hooks";
import {
  DialogModal,
  EmptyState,
  FullScreenLoader,
  Button,
  TopBar,
  HomeCard,
  SwitchTile,
  SkeletonTileGrid,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";
import {
  creatUserHome,
  deleteUserHome,
  editUserHome,
} from "../module/modules";
import {
  addUserSwitchFavorite,
  getUpdatedState,
  removeUserSwitchFavorite,
  updateSwitchState,
} from "../routes/HomeDetails/routes/Rooms/module/modules";
import CreateEditModal from "./CreateEditModal";
import { useNavigate, useOutlet } from "react-router-dom";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const UserHomes = (props) => {
  const { openSettings } = useOutlet()?.context || {};
  const { state } = useContext(AppContext);
  const [homeModalMode, setHomeModalMode] = useState("");
  const [selectedHome, setSelectedHome] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const navigate = useNavigate();

  const { userHomes, userHomesIsLoading, userHomesQueryProps } = useFetchData({
    params: { userDetails: { userId: _.get(state, "userInfo.userId", "") } },
    path: "home/userHomes",
    queryName: "userHomes",
  });

  const {
    userFavoriteSwitches,
    userFavoriteSwitchesIsLoading,
    userFavoriteSwitchesQueryProps,
  } = useFetchData({
    params: { favoriteEntityDetails: { entityType: "SWITCH" } },
    path: "user/get-favorite-entity",
    queryName: "userFavoriteSwitches",
  });

  const isLoading = userHomesIsLoading || userFavoriteSwitchesIsLoading;
  const childcomp = useOutlet({ userHomes, openSettings });
  if (childcomp && !isLoading) return childcomp;

  const onCreateHomeClick = () => setHomeModalMode("CREATE");
  const onHomeClose = () => {
    setHomeModalMode("");
    setSelectedHome(null);
  };

  const onCreateHome = async ({ name, mode, id }) => {
    onHomeClose();
    setShowLoader(true);
    if (mode === "CREATE") await creatUserHome({ name });
    else if (mode === "EDIT") await editUserHome({ name, id });
    await userHomesQueryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = (option) => {
    const { id, home } = option;
    if (id === "rename") {
      setHomeModalMode("EDIT");
      setSelectedHome(home);
    } else if (id === "delete") {
      setShowDeleteDialogue(true);
      setSelectedHome(home);
    }
  };

  const onDeleteHome = async () => {
    const { id } = selectedHome;
    setShowDeleteDialogue(false);
    setSelectedHome(null);
    setShowLoader(true);
    await deleteUserHome({ id });
    await userHomesQueryProps.refetch();
    setShowLoader(false);
  };

  const onCardClick = ({ id }) => navigate(`./${id}`);

  // Switch tile callbacks for favorites grid
  const onFavoriteToggle = async (switchData) => {
    await updateSwitchState({
      id: switchData.id,
      state: switchData.state,
    });
  };
  const onUnfavorite = async ({ id }) => {
    await removeUserSwitchFavorite({ id });
    await userFavoriteSwitchesQueryProps.refetch();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <TopBar
        title="Homes"
        showBack={false}
        onSettingsClick={openSettings}
      />
      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        {isLoading ? (
          <SkeletonTileGrid count={6} />
        ) : _.isEmpty(userHomes) ? (
          <EmptyState
            buttonText="Create home"
            onButtonClick={onCreateHomeClick}
            showButton
            title="No homes yet"
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {!_.isEmpty(userFavoriteSwitches) && (
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1, letterSpacing: 0.6 }}>
                  FAVORITES
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 1,
                  }}
                >
                  {_.map(userFavoriteSwitches, (sd) => (
                    <SwitchTile
                      key={sd.id}
                      switchData={sd}
                      isFavorite
                      showOptions={false}
                      onToggle={async ({ id, state }) => {
                        await updateSwitchState({ id, state });
                        await userFavoriteSwitchesQueryProps.refetch();
                      }}
                      onFavoriteToggle={onUnfavorite}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0.6 }}>
                  MY HOMES
                </Typography>
                <Button onClick={onCreateHomeClick} variant="contained" size="small" startIcon={<AddRounded />}>
                  Add
                </Button>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 1,
                }}
              >
                {_.map(userHomes, (home) => (
                  <HomeCard
                    key={home.id}
                    home={home}
                    onClick={onCardClick}
                    onOptionClick={onOptionClick}
                    showOptions={home.user_role !== USER_ROLE_GUEST}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {homeModalMode && (
        <CreateEditModal
          mode={homeModalMode}
          onClose={onHomeClose}
          onCreate={onCreateHome}
          homeDetails={selectedHome}
        />
      )}
      {showLoader && <FullScreenLoader />}
      {showDeleteDialogue && (
        <DialogModal
          bodytext="This action can not be undone."
          title={`Delete "${selectedHome?.name}"`}
          onButton1Click={() => setShowDeleteDialogue(false)}
          onClose={() => setShowDeleteDialogue(false)}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteHome}
        />
      )}
    </Box>
  );
};

export default UserHomes;
```

- [ ] **Step 2: Verify**

Run: `npm start`. Log in. Expected:
- Top bar: "Homes" title, no back arrow, ⚙ icon on right.
- Tapping ⚙ → bottom sheet slides up with Theme toggle + Logout.
- If you have favorites: favorites grid at top, "Add home" button + homes grid below.
- Skeleton grid shows briefly while loading.

- [ ] **Step 3: Commit**

```bash
git add src/routes/routes/UserHomes/components/UserHomes.js
git commit -m "feat: revamp Homes landing (TopBar + HomeCard + SwitchTile)"
```

---

### Task 19: HomeDetails route revamp

**Files:**
- Modify: `src/routes/routes/UserHomes/routes/HomeDetails/components/HomeDetails.js`

- [ ] **Step 1: Read existing HomeDetails.js to preserve data flow**

Run: `cat src/routes/routes/UserHomes/routes/HomeDetails/components/HomeDetails.js`
Note: tabs (Rooms / AccessControll), how rooms are fetched, how the route outlet for nested Room is rendered.

- [ ] **Step 2: Replace HomeDetails.js with new layout**

```js
// src/routes/routes/UserHomes/routes/HomeDetails/components/HomeDetails.js
import React, { useContext, useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import { useFetchData } from "hooks";
import {
  Button,
  DialogModal,
  EmptyState,
  FullScreenLoader,
  RoomCard,
  SkeletonTileGrid,
  TopBar,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import _ from "lodash";
import { creatRoom, deleteRoom, editRoom } from "../module/modules";
import CreateEditModal from "./CreateEditModal";
import AccessControll from "../routes/AccessControll/components/AccessControll";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const HomeDetails = () => {
  const { userHomes, openSettings } = useOutletContext();
  const { homeId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(AppContext);

  const userHome = _.find(userHomes, (h) => String(h.id) === String(homeId));
  const [tab, setTab] = useState("rooms");
  const [roomModalMode, setRoomModalMode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

  const { homeRooms, homeRoomsIsLoading, homeRoomsQueryProps } = useFetchData({
    params: { roomDetails: { homeId } },
    path: "room/homeRooms",
    queryName: ["homeRooms", homeId],
  });

  const childComp = useOutlet({ homeRooms, userHome, openSettings });
  if (childComp) return childComp;

  const isGuest = userHome?.user_role === USER_ROLE_GUEST;

  const onAddRoomClick = () => setRoomModalMode("CREATE");
  const onRoomModalClose = () => {
    setRoomModalMode("");
    setSelectedRoom(null);
  };

  const onCreateRoom = async ({ name, mode, id }) => {
    onRoomModalClose();
    setShowLoader(true);
    if (mode === "CREATE") await creatRoom({ name, homeId });
    else if (mode === "EDIT") await editRoom({ name, id });
    await homeRoomsQueryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = ({ id, room }) => {
    if (id === "rename") {
      setRoomModalMode("EDIT");
      setSelectedRoom(room);
    } else if (id === "delete") {
      setShowDeleteDialogue(true);
      setSelectedRoom(room);
    }
  };

  const onDeleteRoom = async () => {
    const { id } = selectedRoom;
    setShowDeleteDialogue(false);
    setSelectedRoom(null);
    setShowLoader(true);
    await deleteRoom({ id });
    await homeRoomsQueryProps.refetch();
    setShowLoader(false);
  };

  const onRoomClick = ({ id }) => navigate(`./rooms/${id}`);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <TopBar
        title={userHome?.name || "Home"}
        onBackClick={() => navigate("/userHomes")}
        onSettingsClick={openSettings}
      />
      <Tabs
        value={tab}
        onChange={(_e, v) => setTab(v)}
        sx={{ px: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab value="rooms" label="Rooms" sx={{ textTransform: "none" }} />
        <Tab value="access" label="Access" sx={{ textTransform: "none" }} />
      </Tabs>

      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        {tab === "rooms" ? (
          homeRoomsIsLoading ? (
            <SkeletonTileGrid count={6} />
          ) : _.isEmpty(homeRooms) ? (
            <EmptyState
              buttonText="Create room"
              onButtonClick={onAddRoomClick}
              showButton={!isGuest}
              title="No rooms yet"
            />
          ) : (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0.6 }}>
                  ROOMS
                </Typography>
                {!isGuest && (
                  <Button onClick={onAddRoomClick} variant="contained" size="small" startIcon={<AddRounded />}>
                    Add
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: 1,
                }}
              >
                {_.map(homeRooms, (room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onClick={onRoomClick}
                    onOptionClick={onOptionClick}
                    showOptions={!isGuest}
                  />
                ))}
              </Box>
            </Box>
          )
        ) : (
          <AccessControll userHome={userHome} />
        )}
      </Box>

      {roomModalMode && (
        <CreateEditModal
          mode={roomModalMode}
          onClose={onRoomModalClose}
          onCreate={onCreateRoom}
          roomDetails={selectedRoom}
        />
      )}
      {showLoader && <FullScreenLoader />}
      {showDeleteDialogue && (
        <DialogModal
          bodytext="This action can not be undone."
          title={`Delete "${selectedRoom?.name}"`}
          onButton1Click={() => setShowDeleteDialogue(false)}
          onClose={() => setShowDeleteDialogue(false)}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteRoom}
        />
      )}
    </Box>
  );
};

export default HomeDetails;
```

> **Note:** if the existing module path (`../module/modules`) or method names differ, keep the original imports — only the JSX structure should change.

- [ ] **Step 3: Verify**

Run: `npm start`. Tap a home from Homes. Expected:
- Top bar: home name, back arrow returns to Homes, ⚙ on right.
- Tabs "Rooms" / "Access".
- Rooms tab: grid of `RoomCard`, "Add" button when not guest, skeletons during load, empty state when no rooms.
- Access tab: existing AccessControll component (visual restyle deferred — works as-is).

- [ ] **Step 4: Commit**

```bash
git add src/routes/routes/UserHomes/routes/HomeDetails/components/HomeDetails.js
git commit -m "feat: revamp HomeDetails (TopBar + RoomCard grid + tabs)"
```

---

### Task 20: RoomDetails route revamp + "All off"

**Files:**
- Modify: `src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/RoomDetails.js`

- [ ] **Step 1: Read the existing RoomDetails.js**

Run: `cat src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/RoomDetails.js`
Confirm module imports (`creatSwitches`, `deleteRoomSwitch`, `editRoomSwitch`, `updateSwitchState`, `addUserSwitchFavorite`, `removeUserSwitchFavorite`).

- [ ] **Step 2: Replace RoomDetails.js**

```js
// src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/RoomDetails.js
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { AddRounded, PowerSettingsNewRounded } from "@mui/icons-material";
import { useFetchData } from "hooks";
import {
  Button,
  DialogModal,
  EmptyState,
  FullScreenLoader,
  SkeletonTileGrid,
  SwitchTile,
  TopBar,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import _ from "lodash";
import {
  creatSwitches,
  deleteRoomSwitch,
  editRoomSwitch,
} from "../module/modules";
import {
  addUserSwitchFavorite,
  removeUserSwitchFavorite,
  updateSwitchState,
} from "../../../module/modules";
import CreateEditModal from "./CreateEditModal";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const RoomDetails = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const { roomId = "", homeId } = useParams();
  const { homeRooms, userHome, openSettings } = useOutletContext();

  const room = useMemo(
    () => _.find(homeRooms, (r) => String(r.id) === String(roomId)),
    [homeRooms, roomId]
  );

  useEffect(() => {
    if (!_.isNil(homeRooms) && !room) navigate("/");
  }, [homeRooms, room, navigate]);

  const [switchModalMode, setSwitchModalMode] = useState("");
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const [allOffPending, setAllOffPending] = useState(false);

  const { roomSwitches, roomSwitchesIsLoading, roomSwitchesQueryProps } =
    useFetchData({
      params: { switchDetails: { roomId } },
      path: "switch/roomSwitches",
      queryName: ["roomSwitches", roomId],
    });

  const {
    userFavoriteSwitches,
    userFavoriteSwitchesQueryProps,
  } = useFetchData({
    params: { favoriteEntityDetails: { entityType: "SWITCH" } },
    path: "user/get-favorite-entity",
    queryName: "userFavoriteSwitches",
  });

  const isGuest = userHome?.user_role === USER_ROLE_GUEST;
  const onSwitches = _.filter(roomSwitches, (s) => s.state === "ON");

  const onAddSwitchClick = () => setSwitchModalMode("CREATE");
  const onSwitchModalClose = () => {
    setSwitchModalMode("");
    setSelectedSwitch(null);
  };

  const onCreateSwitch = async ({ name, mode, microcontrollerId, type, id }) => {
    onSwitchModalClose();
    setShowLoader(true);
    if (mode === "CREATE") await creatSwitches({ roomId, microcontrollerId, type });
    else if (mode === "EDIT") await editRoomSwitch({ name, type, id });
    await roomSwitchesQueryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = ({ id, switchData }) => {
    if (id === "rename") {
      setSwitchModalMode("EDIT");
      setSelectedSwitch(switchData);
    } else if (id === "delete") {
      setShowDeleteDialogue(true);
      setSelectedSwitch(switchData);
    }
  };

  const onDeleteSwitch = async () => {
    const { id } = selectedSwitch;
    setShowDeleteDialogue(false);
    setSelectedSwitch(null);
    setShowLoader(true);
    await deleteRoomSwitch({ id });
    await roomSwitchesQueryProps.refetch();
    setShowLoader(false);
  };

  const onToggleSwitch = async ({ id, state }) => {
    await updateSwitchState({ id, state });
    // No refetch here — SwitchTile's optimistic state IS the source of truth
    // for ~600ms. A future MQTT-driven push or periodic refetch reconciles drift.
  };

  const onFavoriteToggle = async ({ id, isFavorite }) => {
    if (isFavorite) await removeUserSwitchFavorite({ id });
    else await addUserSwitchFavorite({ id });
    await userFavoriteSwitchesQueryProps.refetch();
  };

  const onAllOff = async () => {
    if (allOffPending || _.isEmpty(onSwitches)) return;
    setAllOffPending(true);
    await Promise.all(onSwitches.map((s) => updateSwitchState({ id: s.id, state: "OFF" })));
    await roomSwitchesQueryProps.refetch();
    setAllOffPending(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <TopBar
        title={room?.name || "Room"}
        onBackClick={() => navigate(`/userHomes/${homeId}`)}
        onSettingsClick={openSettings}
      />
      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        {roomSwitchesIsLoading ? (
          <SkeletonTileGrid count={6} />
        ) : _.isEmpty(roomSwitches) ? (
          <EmptyState
            buttonText="Create switch"
            onButtonClick={onAddSwitchClick}
            showButton={!isGuest}
            title="No switches yet"
          />
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 1 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0.6 }}>
                SWITCHES
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {!_.isEmpty(onSwitches) && (
                  <Button
                    onClick={onAllOff}
                    variant="outlined"
                    size="small"
                    startIcon={<PowerSettingsNewRounded />}
                    disabled={allOffPending}
                  >
                    All off
                  </Button>
                )}
                {!isGuest && (
                  <Button onClick={onAddSwitchClick} variant="contained" size="small" startIcon={<AddRounded />}>
                    Add
                  </Button>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 1,
              }}
            >
              {_.map(roomSwitches, (sd) => (
                <SwitchTile
                  key={sd.id}
                  switchData={sd}
                  showOptions={!isGuest}
                  isFavorite={_.some(userFavoriteSwitches, (f) => f.id === sd.id)}
                  onToggle={onToggleSwitch}
                  onFavoriteToggle={onFavoriteToggle}
                  onOptionClick={onOptionClick}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {switchModalMode && (
        <CreateEditModal
          mode={switchModalMode}
          onClose={onSwitchModalClose}
          onCreate={onCreateSwitch}
          switchDetails={selectedSwitch}
        />
      )}
      {showLoader && <FullScreenLoader />}
      {showDeleteDialogue && (
        <DialogModal
          bodytext="This action can not be undone."
          title={`Delete "${selectedSwitch?.name}"`}
          onButton1Click={() => setShowDeleteDialogue(false)}
          onClose={() => setShowDeleteDialogue(false)}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteSwitch}
        />
      )}
    </Box>
  );
};

export default RoomDetails;
```

- [ ] **Step 3: Verify**

Run: `npm start`. Tap a home → tap a room. Expected:
- Top bar: room name, back returns to home, ⚙ on right.
- Tile grid of switches; tap a tile = optimistic flip + dim until server confirms.
- If any switch is on: "All off" button appears next to "Add".
- Skeleton grid during load.

- [ ] **Step 4: Commit**

```bash
git add src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/RoomDetails.js
git commit -m "feat: revamp RoomDetails (SwitchTile grid + All-off)"
```

---

### Task 21: CreateEditModal for switches — DeviceTypePicker

**Files:**
- Modify: `src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/CreateEditModal/CreateEditModal.js`

- [ ] **Step 1: Read existing CreateEditModal.js to preserve form fields**

Run:
```bash
cat src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/CreateEditModal/CreateEditModal.js
```
Note current state shape (name, microcontrollerId, etc.).

- [ ] **Step 2: Add type to state and DeviceTypePicker into the modal**

Add to the imports:
```js
import { DeviceTypePicker } from "commonComponents";
import { DEFAULT_DEVICE_TYPE } from "constants/deviceTypes";
```

Add to state initialization (alongside `name`, `microcontrollerId`):
```js
const [type, setType] = useState(switchDetails?.type || DEFAULT_DEVICE_TYPE);
```

In the JSX, after the name field (and before the action buttons), add:
```jsx
<Box sx={{ mt: 2 }}>
  <DeviceTypePicker value={type} onChange={setType} />
</Box>
```

In the submit handler, include `type`:
```js
onCreate({ name, mode, microcontrollerId, type, id: switchDetails?.id });
```

- [ ] **Step 3: Verify**

Run: `npm start`. Open create-switch modal → device-type chips visible, default to Light. Edit existing switch → modal shows its current type (or Light if `type` field is null).

- [ ] **Step 4: Commit**

```bash
git add src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/CreateEditModal/CreateEditModal.js
git commit -m "feat: switch CreateEditModal includes DeviceTypePicker"
```

---

## Phase 4 — Device type backend wiring

### Task 22: REST API — accept `type` in switch endpoints

**Files (in `Homeautomation_lamda_REST_API` repo):**
- Modify: `src/controllers/switchController.js`
- Modify: `src/models/Switch.js`

- [ ] **Step 1: Read existing switchController**

Run:
```bash
cat ../../Homeautomation_lamda_REST_API/src/controllers/switchController.js
```
Confirm where `switchDetails` is destructured for create and update.

- [ ] **Step 2: Ensure `type` flows through createNewSwitches**

In `createNewSwitches`, when building the insert payload pass `type` (default `'light'` if absent):

```js
const type = switchDetails.type || 'light';
// existing code...
const rows = await Switch.create({ /* existing fields */, type });
```

(Exact wiring depends on the existing model — if `Switch.create` takes a full row already including `type`, just ensure the route handler passes `type`.)

- [ ] **Step 3: Ensure `type` flows through updateSwitchDetails**

In `updateSwitchDetails`:
```js
const { id, name, type } = switchDetails;
const updates = {};
if (name !== undefined) updates.name = name;
if (type !== undefined) updates.type = type;
return Switch.update({ id, updates });
```

- [ ] **Step 4: Verify on local serverless-offline**

Run from REST API repo:
```bash
npm start    # = npx serverless offline start --reloadHandler
```
With dev web app pointed at `http://localhost:4000/staging/`, create a switch with type "Fan" → verify in DB:
```sql
SELECT id, name, type FROM switch ORDER BY id DESC LIMIT 5;
```
Expected: latest row has `type = 'fan'`.

- [ ] **Step 5: Commit and deploy**

```bash
cd ../Homeautomation_lamda_REST_API
git add src/controllers/switchController.js src/models/Switch.js
git commit -m "feat: accept and persist switch.type in create/update"
npm run deploy
```

---

### Task 23: DB migration — backfill `type='light'` for legacy rows

**Files:**
- Create: `Homeautomation_lamda_REST_API/src/db/migrations/20260514_009_backfill_switch_type.js`

- [ ] **Step 1: Create the migration**

```js
// 20260514_009_backfill_switch_type.js
exports.up = function (knex) {
  return knex.raw(`UPDATE "switch" SET type = 'light' WHERE type IS NULL`);
};

exports.down = function (knex) {
  // No-op: we never want to un-backfill.
  return Promise.resolve();
};
```

- [ ] **Step 2: Run the migration locally**

```bash
cd Homeautomation_lamda_REST_API
npm run migration
```
Expected output: `Batch N run: 1 migrations`.

- [ ] **Step 3: Verify**

```sql
SELECT COUNT(*) FROM "switch" WHERE type IS NULL;
```
Expected: `0`.

- [ ] **Step 4: Commit and deploy**

```bash
git add src/db/migrations/20260514_009_backfill_switch_type.js
git commit -m "chore: backfill switch.type = 'light' for legacy rows"
npm run deploy   # applies migration in staging
```

---

## Phase 5 — Cleanup

### Task 24: Delete dead components

**Files:**
- Delete: `src/commonComponents/BreadCrumbs/`
- Delete: `src/commonComponents/Loader/`
- Delete: `src/routes/routes/UserHomes/components/SwitchCard/`
- Delete: `src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/SwitchCard/`
- Modify: `src/commonComponents/index.js` (drop `BreadCrumbs` and `Loader` exports)

- [ ] **Step 1: Verify no live references**

```bash
grep -rE "BreadCrumbs|from \"commonComponents/Loader\"|/SwitchCard\"|import SwitchCard" src/
```
Expected: only references inside the four directories about to be deleted (and possibly inside `commonComponents/index.js`). Anything else means a page migration was missed — fix it first.

- [ ] **Step 2: Delete the directories**

```bash
rm -rf src/commonComponents/BreadCrumbs
rm -rf src/commonComponents/Loader
rm -rf src/routes/routes/UserHomes/components/SwitchCard
rm -rf src/routes/routes/UserHomes/routes/HomeDetails/routes/Rooms/routes/RoomDetails/components/SwitchCard
```

- [ ] **Step 3: Update barrel export**

In `src/commonComponents/index.js` remove the `BreadCrumbs` and `Loader` import and export lines. Final file:

```js
import GoogleLoginWrapper from "./GoogleLoginWrapper";
import FullScreenLoader from "./FullScreenLoader";
import EmptyState from "./EmptyState";
import Modal from "./Modal";
import DropDownMenu from "./DropDownMenu";
import DialogModal from "./DialogModal";
import Button from "./Button";
import TopBar from "./TopBar";
import SwitchTile from "./SwitchTile";
import HomeCard from "./HomeCard";
import RoomCard from "./RoomCard";
import SkeletonTile, { SkeletonTileGrid } from "./SkeletonTile";
import SettingsSheet from "./SettingsSheet";
import DeviceTypePicker from "./DeviceTypePicker";

export {
  GoogleLoginWrapper,
  FullScreenLoader,
  EmptyState,
  Modal,
  DropDownMenu,
  DialogModal,
  Button,
  TopBar,
  SwitchTile,
  HomeCard,
  RoomCard,
  SkeletonTile,
  SkeletonTileGrid,
  SettingsSheet,
  DeviceTypePicker,
};
```

- [ ] **Step 4: Verify compile**

Run: `npm start`
Expected: clean compile, app boots, all pages load.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove BreadCrumbs, Loader, and legacy SwitchCard components"
```

---

### Task 25: Final responsive + theme matrix

This is the only "manual test plan" task. No code change.

- [ ] **Step 1: Build production**

```bash
npm run build
```
Expected: build completes without errors. Check bundle size — should not be wildly larger than before.

- [ ] **Step 2: Manual responsive matrix**

Use Chrome devtools device toolbar. For each viewport — 360, 768, 1200 — visit each of:

- `/login`
- `/signup`
- `/userHomes`
- `/userHomes/:homeId` (Rooms tab)
- `/userHomes/:homeId` (Access tab)
- `/userHomes/:homeId/rooms/:roomId`

Confirm: no horizontal scroll, tap targets ≥ 36px tall, text readable, no overlapping content.

- [ ] **Step 3: Manual theme matrix**

For each route above:
- Set `localStorage.setItem('ha_theme_override', 'light'); location.reload();` → confirm light visuals.
- Set `localStorage.setItem('ha_theme_override', 'dark'); location.reload();` → confirm dark visuals (text readable, no white panels on dark bg).
- Set `localStorage.removeItem('ha_theme_override'); location.reload();` → confirm auto follows system.

- [ ] **Step 4: End-to-end switch toggle**

With a real or staging ESP32 connected: toggle SWITCH_1 from RoomDetails.

Expected:
- Tile flips instantly (optimistic).
- Tile dims to ~55% for ~200-1000ms.
- ESP32 serial shows `incoming: ... SWITCH_1: ON` and relay clicks.
- Tile un-dims.

Toggle 3-4 rapid times in a row to confirm no UI lock-up.

- [ ] **Step 5: All-off button check**

Turn 3 switches on individually, then tap "All off". Expected: all three dim+disable simultaneously, then return to OFF.

- [ ] **Step 6: SettingsSheet check**

Tap ⚙ → bottom sheet slides up. Toggle theme → background changes. Tap Logout → returns to login screen.

- [ ] **Step 7: DeviceTypePicker check**

Create a new switch with type "Fan". On the room detail grid, confirm the new tile shows the fan icon, not the lightbulb.

- [ ] **Step 8: Commit checklist completion**

If everything passed, no code change to commit — but write a closing note. If anything failed, file the issue and fix before declaring done.

```bash
# Optional final commit
git commit --allow-empty -m "docs: UI revamp checklist complete"
```

---

## Self-Review (Run after writing this plan; fix inline)

**Spec coverage check:**

- Visual direction (Material You): Tasks 1-4 ✓
- Purple seed: Tasks 1-2 ✓
- Auto theme + override: Task 5 + Task 12 ✓
- One-row top bar: Task 7 + applied in Tasks 18-20 ✓
- Hybrid optimistic toggle: Task 9 ✓
- Device-type icons (5 types): Task 6 + Task 9 + Task 13 ✓
- Skeleton loading: Task 8 + applied in pages ✓
- HomeCard "N of M switches on": Task 10 ✓
- RoomDetails "All off" button: Task 20 ✓
- Favorites at top of Homes landing: Task 18 ✓
- Login hero treatment: Task 16 ✓
- Settings sheet (theme/logout): Task 12 ✓
- Remove BreadCrumbs / Loader / old SwitchCard: Task 24 ✓
- App name unchanged: Task 15 + Task 16 ✓
- Backend `type` field flow: Task 22 + Task 23 ✓

**Type consistency:**

- `getDeviceType(value)` returns `{ value, label, iconOn, iconOff }` — used in `SwitchTile`, `DeviceTypePicker`. ✓
- `SwitchTile` accepts `switchData: { id, name, state, type }` — matches `roomSwitches` API row + `userFavoriteSwitches`. ✓
- `HomeCard` accepts `home: { id, name, room_count, active_switch_count, total_switch_count, user_role }` — `active_switch_count` and `total_switch_count` may not yet exist on the home endpoint response; the component falls back to `room_count` summary so it works either way. **Backend note:** if you later want the "N of M on" summary to be accurate, add a `LEFT JOIN switch` aggregate in the `/home/userHomes` query — out of scope for this plan but flagged. ✓
- `RoomCard` accepts `room: { id, name, active_switch_count, total_switch_count }` — same caveat as `HomeCard`. ✓

**Placeholder scan:** none found.

**Scope check:** 25 tasks, all bite-sized (2-15 min each). Largest is Task 9 (SwitchTile) — ~10 minutes to copy/paste + verify.

---

## Out of scope (deferred)

- Web Bluetooth path (firmware Phase 3 g).
- Device Shadow integration (firmware Phase 3 e2).
- Backend aggregate query for accurate `active_switch_count` on home/room endpoints.
- Fan speed slider (requires PWM firmware).
- Schedules / automations.
- Multi-user invite UI restyle (existing AccessControll works as-is for now).
