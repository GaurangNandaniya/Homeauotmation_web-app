import React, { useEffect, useMemo } from "react";
import {
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import _ from "lodash";
import { Box, Tabs, Tab } from "@mui/material";
import { TopBar } from "commonComponents";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const HomeDetails = () => {
  const ctx = useOutletContext() || {};
  const { userHomes = [], openSettings } = ctx;
  const { homeId = "" } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const userHome = useMemo(
    () => _.find(userHomes, (home) => home.id == homeId),
    [userHomes, homeId]
  );
  const isGuest = _.get(userHome, "user_role") === USER_ROLE_GUEST;

  const childcomp = useOutlet({ userHome, openSettings });

  // Redirect bare /userHomes/:homeId → /rooms (default tab).
  const basePath = `/userHomes/${homeId}`;
  useEffect(() => {
    if (
      !_.isNil(userHomes) &&
      !_.some(userHomes, (h) => h.id == homeId)
    ) {
      navigate("/");
      return;
    }
    if (pathname === basePath || pathname === `${basePath}/`) {
      navigate("./rooms", { replace: true });
    }
  }, [userHomes, homeId, pathname, basePath, navigate]);

  // When inside RoomDetails (deeper than /rooms), RoomDetails owns the screen
  // — render only its outlet, skip tabs and TopBar.
  const inRoomDetail = /\/rooms\/[^/]+$/.test(pathname);
  if (inRoomDetail) return childcomp;

  const activeTab = pathname.includes("/access-controll") ? "access" : "rooms";

  const onTabChange = (_e, val) => {
    if (val === "rooms") navigate("./rooms");
    else navigate("./access-controll");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <TopBar
        title={userHome?.name || "Home"}
        onBackClick={() => navigate("/userHomes")}
        onSettingsClick={openSettings}
      />
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        centered
        sx={{
          minHeight: 44,
          "& .MuiTab-root": { textTransform: "none", minHeight: 44, px: 3 },
        }}
      >
        <Tab value="rooms" label="Rooms" />
        {!isGuest && <Tab value="access" label="Access" />}
      </Tabs>
      <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {childcomp}
      </Box>
    </Box>
  );
};

export default HomeDetails;
