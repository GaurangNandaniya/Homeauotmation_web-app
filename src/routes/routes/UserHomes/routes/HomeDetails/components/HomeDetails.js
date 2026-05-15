import React, { useContext, useEffect } from "react";
import {
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import _ from "lodash";
import { Box, Typography, useTheme } from "@mui/material";
import {
  ChevronRightRounded,
  MeetingRoomRounded,
  LockPersonRounded,
} from "@mui/icons-material";
import { TopBar } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";
import tokens from "../../../../../../theme/tokens";

const MenuCard = ({ icon: Icon, title, subtitle, onClick }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: theme.palette.surfaceContainer,
        color: theme.palette.text.primary,
        borderRadius: tokens.card.borderRadius,
        p: 2,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "background-color 0.18s ease",
        "&:hover": { bgcolor: theme.palette.surfaceContainerHigh },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 999,
          bgcolor: theme.palette.primaryContainer,
          color: theme.palette.onPrimaryContainer,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      <ChevronRightRounded sx={{ color: "text.secondary" }} />
    </Box>
  );
};

const HomeDetails = () => {
  const ctx = useOutletContext() || {};
  const { userHomes = [], openSettings } = ctx;
  const { homeId = "" } = useParams();
  const navigate = useNavigate();

  const userHome = _.find(userHomes, (home) => home.id == homeId);
  const isGuest = _.get(userHome, "user_role") === USER_ROLE_GUEST;

  const childcomp = useOutlet({ userHome, openSettings });

  useEffect(() => {
    if (!_.isNil(userHomes) && !_.some(userHomes, (h) => h.id == homeId)) {
      navigate("/");
    }
  }, [userHomes, homeId, navigate]);

  if (childcomp) return childcomp;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <TopBar
        title={userHome?.name || "Home"}
        onBackClick={() => navigate("/userHomes")}
        onSettingsClick={openSettings}
      />
      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <MenuCard
            icon={MeetingRoomRounded}
            title="Rooms"
            subtitle={
              userHome?.room_count
                ? `${userHome.room_count} room${userHome.room_count === 1 ? "" : "s"}`
                : "No rooms yet"
            }
            onClick={() => navigate("./rooms")}
          />
          {!isGuest && (
            <MenuCard
              icon={LockPersonRounded}
              title="Access control"
              subtitle="Share this home with others"
              onClick={() => navigate("./access-controll")}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeDetails;
