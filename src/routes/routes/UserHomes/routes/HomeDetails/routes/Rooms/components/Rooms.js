import React, { useState } from "react";
import _ from "lodash";
import { Box, Typography } from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import {
  Button,
  DialogModal,
  EmptyState,
  FullScreenLoader,
  RoomCard,
  SkeletonTileGrid,
} from "commonComponents";
import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router-dom";
import { useFetchData } from "hooks";
import CreateEditModal from "./CreateEditModal";
import { creatHomeRoom, deleteHomeRoom, editHomeRoom } from "../modules/modules";
import tokens from "../../../../../../../../theme/tokens";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const Rooms = () => {
  const ctx = useOutletContext() || {};
  const { userHome, openSettings } = ctx;
  const { homeId = "" } = useParams();
  const navigate = useNavigate();

  const [roomModalMode, setRoomModalMode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

  const {
    data: homeRooms,
    isLoading,
    queryProps,
  } = useFetchData({
    params: { roomDetails: { homeId } },
    path: "/room/homeRooms",
  });

  const childcomp = useOutlet({ homeRooms, userHome, openSettings });
  if (childcomp) return childcomp;

  const isGuest = userHome?.user_role === USER_ROLE_GUEST;

  const onCreateRoomClick = () => setRoomModalMode("CREATE");
  const onRoomClose = () => {
    setRoomModalMode("");
    setSelectedRoom(null);
  };

  const onCreateRoom = async ({ name, mode, id }) => {
    onRoomClose();
    setShowLoader(true);
    if (mode === "CREATE") await creatHomeRoom({ name, homeId });
    else if (mode === "EDIT") await editHomeRoom({ name, id });
    await queryProps.refetch();
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
    await deleteHomeRoom({ id });
    await queryProps.refetch();
    setShowLoader(false);
  };

  const onCardClick = ({ id }) => navigate(`./${id}`);

  return (
    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {isLoading ? (
        <SkeletonTileGrid count={6} />
      ) : _.isEmpty(homeRooms) ? (
        <EmptyState
          buttonText="Create room"
          onButtonClick={onCreateRoomClick}
          showButton={!isGuest}
          title="No rooms yet"
        />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", letterSpacing: "0.05em" }}
            >
              ROOMS
            </Typography>
            {!isGuest && (
              <Button
                onClick={onCreateRoomClick}
                variant="contained"
                size="small"
                startIcon={<AddRounded />}
              >
                Add
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.grid.minColWidth}px, 1fr))`,
              gap: tokens.grid.gap,
            }}
          >
            {_.map(homeRooms, (room) => (
              <RoomCard
                key={room.id}
                room={{
                  id: room.id,
                  name: room.name,
                  active_switch_count: room.active_switch_count,
                  total_switch_count: room.switch_count,
                }}
                onClick={onCardClick}
                onOptionClick={onOptionClick}
                showOptions={!isGuest}
              />
            ))}
          </Box>
        </>
      )}

      {roomModalMode && (
        <CreateEditModal
          mode={roomModalMode}
          onClose={onRoomClose}
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

export default Rooms;
