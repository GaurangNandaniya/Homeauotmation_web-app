import React, { useContext, useEffect, useState } from "react";
import classes from "./RoomDetails.scss";
import {
  BreadCrumbs,
  Button,
  DialogModal,
  EmptyState,
  FullScreenLoader,
  Loader,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import { TouchAppRounded } from "@mui/icons-material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CreateEditModal from "./CreateEditModal";
import { useFetchData } from "hooks";
import { Typography } from "@mui/material";
import _ from "lodash";
import {
  creatSwitches,
  deleteRoomSwitch,
  editRoomSwitch,
} from "../module/modules";
import SwitchCard from "./SwitchCard";
const BREADCRUMB_ID = "ROOMS_DETAILS";

const RoomDetails = () => {
  const { state, dispatch } = useContext(AppContext);
  const [switchModalMode, setSwitchModalMode] = useState("");
  const [selectedSwitch, setSelectedSwitch] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const navigate = useNavigate();
  const { roomId = "", homeId } = useParams();
  const { homeRooms } = useOutletContext();

  useEffect(() => {
    if (!_.some(homeRooms, (room) => room.id == roomId)) {
      navigate("/");
    }
  }, [homeRooms]);

  useEffect(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <TouchAppRounded />,
        label: "RoomDetails",
        route: `/userHomes/${homeId}/rooms/${roomId}`,
      },
    });
    return () => {
      dispatch({
        type: REMOVE_BREADCRUMS_ITEM,
        value: {
          id: BREADCRUMB_ID,
        },
      });
    };
  }, []);

  const { roomSwitches, roomSwitchesIsLoading, roomSwitchesQueryProps } =
    useFetchData({
      params: {
        switchDetails: {
          roomId,
        },
      },
      path: "switch/roomSwitches",
      queryName: "roomSwitches",
    });

  /**
   *  "id",
      "switch_name",
      "state",
      "room_name",
      "home_name"
   */
  const {
    userFavoriteSwitches,
    userFavoriteSwitchesIsLoading,
    userFavoriteSwitchesQueryProps,
  } = useFetchData({
    params: {
      favoriteEntityDetails: {
        entityType: "SWITCH",
      },
    },
    path: "user/get-favorite-entity",
    queryName: "userFavoriteSwitches",
  });
  const isLoading = roomSwitchesIsLoading;

  const onAddSwitchClick = () => {
    setSwitchModalMode("CREATE");
  };
  const onSwitchModalClose = () => {
    setSwitchModalMode("");
    setSelectedSwitch(null);
  };

  const onCreateSwitch = async ({ name, mode, microcontrollerId, id }) => {
    onSwitchModalClose();
    setShowLoader(true);
    switch (mode) {
      case "CREATE":
        await creatSwitches({ roomId, microcontrollerId });
        break;
      case "EDIT":
        await editRoomSwitch({ name, id });
        break;
    }
    await roomSwitchesQueryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = (option) => {
    const { id, switchData } = option;
    switch (id) {
      case "rename":
        setSwitchModalMode("EDIT");
        setSelectedSwitch(switchData);
        break;
      case "delete":
        setShowDeleteDialogue(true);
        setSelectedSwitch(switchData);
        break;
    }
  };

  const handleDialogClose = () => {
    setShowDeleteDialogue(false);
    setSelectedSwitch(null);
  };

  const onDeleteSwitch = async () => {
    const { id } = selectedSwitch;
    handleDialogClose();
    setShowLoader(true);
    await deleteRoomSwitch({ id });
    await roomSwitchesQueryProps.refetch();
    setShowLoader(false);
  };

  return (
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} />
      {isLoading ? (
        <Loader />
      ) : _.isEmpty(homeRooms) ? (
        <EmptyState
          buttonText="Create switch"
          onButtonClick={onAddSwitchClick}
          showButton={true}
          title="You haven't added switch yet!!"
        />
      ) : (
        <>
          <div className={classes.labelContainer}>
            <Typography variant="h4" sx={{ marginBottom: "12px" }}>
              Room details
            </Typography>
            <Button onClick={onAddSwitchClick} variant="contained" size="small">
              Create switch
            </Button>
          </div>
          <div className={classes.switchListContainer}>
            {_.map(roomSwitches, (switchData) => {
              return (
                <SwitchCard
                  key={switchData.id}
                  switchData={switchData}
                  onOptionClick={onOptionClick}
                  roomSwitchesQueryProps={roomSwitchesQueryProps}
                  userFavoriteSwitchesQueryProps={
                    userFavoriteSwitchesQueryProps
                  }
                  isFavorite={_.some(
                    userFavoriteSwitches,
                    (item) => item.id == switchData.id
                  )}
                />
              );
            })}
          </div>
        </>
      )}
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
          onButton1Click={handleDialogClose}
          onClose={handleDialogClose}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteSwitch}
        />
      )}
    </div>
  );
};

export default RoomDetails;
