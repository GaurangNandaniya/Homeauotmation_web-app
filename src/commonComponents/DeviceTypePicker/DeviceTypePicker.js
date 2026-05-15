import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DEVICE_TYPES } from "constants/deviceTypes";
import tokens from "../../theme/tokens";

const DeviceTypePicker = ({ value, onChange, label = "Type" }) => {
  const theme = useTheme();
  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 0.75,
            color: "text.secondary",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.chip.minColWidth}px, 1fr))`,
          gap: tokens.grid.gap,
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
                borderRadius: tokens.chip.borderRadius,
                p: tokens.chip.padding,
                cursor: "pointer",
                textAlign: "center",
                transition: "background-color 0.15s ease, color 0.15s ease",
                minHeight: tokens.chip.minHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.25,
              }}
            >
              <Icon sx={{ fontSize: tokens.icon.chip }} />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "none",
                  letterSpacing: 0,
                  fontSize: 11,
                  fontWeight: 600,
                }}
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
