import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { HomeRounded, MoreVertRounded } from "@mui/icons-material";
import { DropDownMenu } from "commonComponents";
import tokens from "../../theme/tokens";

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
        borderRadius: tokens.card.borderRadius,
        p: tokens.card.padding,
        cursor: "pointer",
        minHeight: tokens.card.minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "background-color 0.18s ease",
        "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <HomeRounded sx={{ fontSize: tokens.icon.card, color: "primary.main" }} />
        {showOptions && (
          <DropDownMenu options={CARD_OPTIONS} onOptionClick={handleOption}>
            <IconButton
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{ color: "inherit", p: 0.5 }}
              aria-label="More"
            >
              <MoreVertRounded sx={{ fontSize: tokens.icon.small }} />
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
          sx={{
            color: "text.secondary",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          {summary}
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeCard;
