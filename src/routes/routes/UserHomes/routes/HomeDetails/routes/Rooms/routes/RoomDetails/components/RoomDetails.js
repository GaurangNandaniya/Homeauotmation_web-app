import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { Box, Typography } from "@mui/material";
import { AddRounded, PowerSettingsNewRounded } from "@mui/icons-material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
import CreateEditModal from "./CreateEditModal";
import {
  addUserSwitchFavorite,
  creatSwitches,
  deleteRoomSwitch,
  editRoomSwitch,
  removeUserSwitchFavorite,
  updateSwitchState,
} from "../module/modules";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";
import tokens from "../../../../../../../../../../theme/tokens";

const RoomDetails = () => {
  const ctx = useOutletContext() || {};
  const { homeRooms, userHome, openSettings } = ctx;
  const { roomId = "", homeId } = useParams();
  const navigate = useNavigate();

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

  const { userFavoriteSwitches, userFavoriteSwitchesQueryProps } = useFetchData({
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

  const onCreateSwitch = async ({ name, mode, microcontrollerId, id }) => {
    onSwitchModalClose();
    setShowLoader(true);
    if (mode === "CREATE") await creatSwitches({ roomId, microcontrollerId });
    else if (mode === "EDIT") await editRoomSwitch({ name, id });
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
    // No refetch — SwitchTile's optimistic flip is the source of truth
    // until the next page load / periodic sync.
  };

  const onFavoriteToggle = async ({ id, isFavorite }) => {
    if (isFavorite) await removeUserSwitchFavorite({ id });
    else await addUserSwitchFavorite({ id });
    await userFavoriteSwitchesQueryProps.refetch();
  };

  const onAllOff = async () => {
    if (allOffPending || _.isEmpty(onSwitches)) return;
    setAllOffPending(true);
    await Promise.all(
      onSwitches.map((s) => updateSwitchState({ id: s.id, state: "OFF" }))
    );
    await roomSwitchesQueryProps.refetch();
    setAllOffPending(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <TopBar
        title={room?.name || "Room"}
        onBackClick={() => navigate(`/userHomes/${homeId}/rooms`)}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
              >
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
                  <Button
                    onClick={onAddSwitchClick}
                    variant="contained"
                    size="small"
                    startIcon={<AddRounded />}
                  >
                    Add
                  </Button>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.grid.minColWidth}px, 1fr))`,
                gap: tokens.grid.gap,
              }}
            >
              {_.map(roomSwitches, (sd) => (
                <SwitchTile
                  key={sd.id}
                  switchData={sd}
                  showOptions={!isGuest}
                  isFavorite={_.some(
                    userFavoriteSwitches,
                    (f) => f.id === sd.id
                  )}
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
