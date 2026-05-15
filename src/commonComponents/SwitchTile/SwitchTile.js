import React, { useState, useCallback } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import {
  StarRounded,
  StarBorderRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import { DropDownMenu } from "commonComponents";
import { getDeviceType } from "constants/deviceTypes";
import tokens from "../../theme/tokens";

const CARD_OPTIONS = [
  { id: "rename", label: "Rename", value: "rename" },
  { id: "delete", label: "Delete", value: "delete" },
];

const SwitchTile = ({
  switchData,
  isFavorite = false,
  showOptions = true,
  showFavorite = true,
  onToggle,
  onFavoriteToggle,
  onOptionClick,
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
      setLocalState(initialState);
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
        borderRadius: tokens.card.borderRadius,
        p: tokens.card.padding,
        cursor: isSyncing ? "wait" : "pointer",
        opacity: isSyncing ? 0.55 : 1,
        pointerEvents: isSyncing ? "none" : "auto",
        transition:
          "opacity 0.18s ease, background-color 0.18s ease, color 0.18s ease",
        minHeight: tokens.card.minHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
        <Icon sx={{ fontSize: tokens.icon.tile }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          {showFavorite && (
            <IconButton
              size="small"
              onClick={handleFavorite}
              sx={{ color: "inherit", opacity: favSyncing ? 0.4 : 1, p: 0.5 }}
              aria-label={isFavorite ? "Unfavorite" : "Favorite"}
            >
              {isFavorite ? (
                <StarRounded sx={{ fontSize: tokens.icon.small }} />
              ) : (
                <StarBorderRounded sx={{ fontSize: tokens.icon.small }} />
              )}
            </IconButton>
          )}
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
      </Box>

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
          {name}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            mt: 0.5,
            px: tokens.pill.paddingX,
            py: tokens.pill.paddingY,
            borderRadius: 999,
            bgcolor: isOn ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
            fontSize: tokens.pill.fontSize,
            fontWeight: tokens.pill.fontWeight,
            letterSpacing: tokens.pill.letterSpacing,
          }}
        >
          {isOn ? "ON" : "OFF"}
        </Box>
      </Box>
    </Box>
  );
};

export default SwitchTile;
