import React, { useContext, useEffect, useState } from "react";
import classes from "./Rooms.scss";
import {
  BreadCrumbs,
  Button,
  DialogModal,
  DropDownMenu,
  EmptyState,
  FullScreenLoader,
  Loader,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import { DoorFrontRounded, MoreVert } from "@mui/icons-material";
import {
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import CreateEditModal from "./CreateEditModal";
import {
  creatHomeRoom,
  deleteHomeRoom,
  editHomeRoom,
} from "../modules/modules";
import { useFetchData, useComponentWillMount } from "hooks";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";
const BREADCRUMB_ID = "ROOMS";

const CARD_OPTIONS = [
  {
    id: "rename",
    label: "Rename",
    value: "rename",
  },
  {
    id: "delete",
    label: "Delete",
    value: "delete",
  },
];

const Rooms = () => {
  const { state, dispatch } = useContext(AppContext);
  const [roomModalMode, setRoomModalMode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const navigate = useNavigate();
  const { homeId = "" } = useParams();
  const { userHome } = useOutletContext();

  useComponentWillMount(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <DoorFrontRounded />,
        label: "Rooms",
        route: `/userHomes/${homeId}/rooms`,
      },
    });
  });

  useEffect(() => {
    return () => {
      dispatch({
        type: REMOVE_BREADCRUMS_ITEM,
        value: {
          id: BREADCRUMB_ID,
        },
      });
    };
  }, []);

  const {
    data: homeRooms,
    isLoading,
    queryProps,
  } = useFetchData({
    params: {
      roomDetails: {
        homeId,
      },
    },
    path: "/room/homeRooms",
  });
  const childcomp = useOutlet({ homeRooms, userHome });

  const onCreateRoomClick = () => {
    setRoomModalMode("CREATE");
  };
  const onRoomClose = () => {
    setRoomModalMode("");
    setSelectedRoom(null);
  };

  const onCreateRoom = async ({ name, mode, id }) => {
    onRoomClose();
    setShowLoader(true);
    switch (mode) {
      case "CREATE":
        await creatHomeRoom({ name, homeId });
        break;
      case "EDIT":
        await editHomeRoom({ name, id });
        break;
    }
    await queryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = (option) => {
    const { id, room } = option;
    switch (id) {
      case "rename":
        setRoomModalMode("EDIT");
        setSelectedRoom(room);
        break;
      case "delete":
        setShowDeleteDialogue(true);
        setSelectedRoom(room);
        break;
    }
  };

  const handleDialogClose = () => {
    setShowDeleteDialogue(false);
    setSelectedRoom(null);
  };

  const onDeleteRoom = async () => {
    const { id } = selectedRoom;
    handleDialogClose();
    setShowLoader(true);
    await deleteHomeRoom({ id });
    await queryProps.refetch();
    setShowLoader(false);
  };

  const onCardClick = ({ id }) => {
    navigate(`./${id}`);
  };

  if (childcomp) {
    return childcomp;
  }

  return (
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} />
      {isLoading ? (
        <Loader />
      ) : _.isEmpty(homeRooms) ? (
        <EmptyState
          buttonText="Create room"
          onButtonClick={onCreateRoomClick}
          showButton={userHome?.user_role != USER_ROLE_GUEST}
          title="You haven't created room yet!!"
        />
      ) : (
        <>
          <div className={classes.labelContainer}>
            <Typography variant="h4" sx={{ marginBottom: "12px" }}>
              Rooms
            </Typography>
            {userHome?.user_role != USER_ROLE_GUEST ? (
              <Button
                onClick={onCreateRoomClick}
                variant="contained"
                size="small"
              >
                Create room
              </Button>
            ) : null}
          </div>
          <div className={classes.roomListContainer}>
            {_.map(homeRooms, (room) => {
              const { id, name, switch_count } = room;
              const onCardOptionClick = (params) => {
                onOptionClick({ ...params, room });
              };
              return (
                <Card
                  className={classes.cardContainer}
                  key={id}
                  onClick={() => onCardClick({ id })}
                >
                  <CardHeader
                    action={
                      userHome?.user_role != USER_ROLE_GUEST ? (
                        <DropDownMenu
                          options={CARD_OPTIONS}
                          onOptionClick={onCardOptionClick}
                        >
                          <IconButton>
                            <MoreVert />
                          </IconButton>
                        </DropDownMenu>
                      ) : null
                    }
                    title={name}
                  />
                  <CardContent>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Switch count: {switch_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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
          onButton1Click={handleDialogClose}
          onClose={handleDialogClose}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteRoom}
        />
      )}
    </div>
  );
};

export default Rooms;
