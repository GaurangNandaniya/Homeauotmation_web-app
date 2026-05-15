import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBack, Settings } from "@mui/icons-material";
import tokens from "../../theme/tokens";

const TopBar = ({ title, showBack = true, onBackClick, onSettingsClick }) => {
  const theme = useTheme();
  const size = tokens.topBar.iconButtonSize;
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: tokens.topBar.paddingX,
        py: tokens.topBar.paddingY,
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
            width: size,
            height: size,
            "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
          }}
          aria-label="Back"
        >
          <ArrowBack fontSize="small" />
        </IconButton>
      ) : (
        <Box sx={{ width: size }} />
      )}
      <Typography
        variant="h3"
        sx={{ flex: 1, fontSize: tokens.topBar.titleSize, fontWeight: 600 }}
        noWrap
      >
        {title}
      </Typography>
      {onSettingsClick && (
        <IconButton
          onClick={onSettingsClick}
          sx={{ color: theme.palette.text.primary, width: size, height: size }}
          aria-label="Settings"
        >
          <Settings fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default TopBar;
