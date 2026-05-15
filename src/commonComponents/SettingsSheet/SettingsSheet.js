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
import tokens from "../../theme/tokens";

const THEMES = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const APP_VERSION = "1.0.0";

const SettingsSheet = ({ open, onClose, onLogout }) => {
  const theme = useTheme();
  const ctx = useContext(AppContext);
  const themeOverride = ctx?.themeOverride || "auto";
  const setThemeOverride = ctx?.setThemeOverride || (() => {});
  const displayName = _.get(ctx, "state.userInfo.firstName", "User");

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: tokens.surface.borderRadius,
          borderTopRightRadius: tokens.surface.borderRadius,
          bgcolor: theme.palette.background.paper,
          px: tokens.surface.paddingX,
          py: tokens.surface.paddingY,
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
              borderRadius: 999,
              bgcolor: theme.palette.divider,
            }}
          />
        </Box>
        <Typography variant="h3">Settings</Typography>

        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mb: 1,
              color: "text.secondary",
              textTransform: "none",
              letterSpacing: 0,
            }}
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
            sx={{
              display: "block",
              mb: 0.5,
              color: "text.secondary",
              textTransform: "none",
              letterSpacing: 0,
            }}
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
          <LogoutRounded sx={{ fontSize: tokens.icon.small }} />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Logout
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          v{APP_VERSION}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SettingsSheet;
