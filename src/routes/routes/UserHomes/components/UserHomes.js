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
  updateSwitchState,
  removeUserSwitchFavorite,
} from "../routes/HomeDetails/routes/Rooms/routes/RoomDetails/module/modules";
import CreateEditModal from "./CreateEditModal";
import { useNavigate, useOutlet, useOutletContext } from "react-router-dom";
import tokens from "../../../../theme/tokens";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const UserHomes = () => {
  const rootCtx = useOutletContext() || {};
  const { openSettings } = rootCtx;

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: tokens.grid.sectionGap }}>
            {!_.isEmpty(userFavoriteSwitches) && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    mb: 1,
                    letterSpacing: "0.05em",
                  }}
                >
                  FAVORITES
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.grid.minColWidth}px, 1fr))`,
                    gap: tokens.grid.gap,
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
                      }}
                      onFavoriteToggle={async ({ id }) => {
                        await removeUserSwitchFavorite({ id });
                        await userFavoriteSwitchesQueryProps.refetch();
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
                >
                  MY HOMES
                </Typography>
                <Button
                  onClick={onCreateHomeClick}
                  variant="contained"
                  size="small"
                  startIcon={<AddRounded />}
                >
                  Add
                </Button>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.grid.homeColWidth}px, 1fr))`,
                  gap: tokens.grid.gap,
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
