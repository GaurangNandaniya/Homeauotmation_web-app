import React, { useContext, useEffect, useState } from "react";
import classes from "./UserHomes.scss";
import { useFetchData, useComponentWillMount } from "hooks";
import {
  DialogModal,
  DropDownMenu,
  EmptyState,
  FullScreenLoader,
  Loader,
  Button,
  BreadCrumbs,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { creatUserHome, deleteUserHome, editUserHome } from "../module/modules";
import { GridViewRounded, MoreVert } from "@mui/icons-material";
import CreateEditModal from "./CreateEditModal";
import { useNavigate, useOutlet } from "react-router-dom";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import SwitchCard from "../components/SwitchCard";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const BREADCRUMB_ID = "USER_HOMES";

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

const UserHomes = (props) => {
  const { state, dispatch } = useContext(AppContext);
  const [homeModalMode, setHomeModalMode] = useState("");
  const [selectedHome, setSelectedHome] = useState(false);
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
    params: {
      favoriteEntityDetails: {
        entityType: "SWITCH",
      },
    },
    path: "user/get-favorite-entity",
    queryName: "userFavoriteSwitches",
  });
  const isLoading = userHomesIsLoading || userFavoriteSwitchesIsLoading;

  const childcomp = useOutlet({ userHomes });
  useComponentWillMount(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <GridViewRounded />,
        label: "Homes",
        route: `/userHomes`,
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

  const onCreateHomeClick = () => {
    setHomeModalMode("CREATE");
  };
  const onHomeClose = () => {
    setHomeModalMode("");
    setSelectedHome(null);
  };

  const onCreateHome = async ({ name, mode, id }) => {
    onHomeClose();
    setShowLoader(true);
    switch (mode) {
      case "CREATE":
        await creatUserHome({ name });
        break;
      case "EDIT":
        await editUserHome({ name, id });
        break;
    }
    await userHomesQueryProps.refetch();
    setShowLoader(false);
  };

  const onOptionClick = (option) => {
    const { id, home } = option;
    switch (id) {
      case "rename":
        setHomeModalMode("EDIT");
        setSelectedHome(home);
        break;
      case "delete":
        setShowDeleteDialogue(true);
        setSelectedHome(home);
        break;
    }
  };
  const handleDialogClose = () => {
    setShowDeleteDialogue(false);
    setSelectedHome(null);
  };

  const onDeleteHome = async () => {
    const { id } = selectedHome;
    handleDialogClose();
    setShowLoader(true);
    await deleteUserHome({ id });
    await userHomesQueryProps.refetch();
    setShowLoader(false);
  };

  const onCardClick = ({ id }) => {
    navigate(`./${id}`);
  };

  if (childcomp && !isLoading) {
    return childcomp;
  }

  return (
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} showBackButton={false} />
      {isLoading ? (
        <Loader />
      ) : _.isEmpty(userHomes) ? (
        <EmptyState
          buttonText="Create home"
          onButtonClick={onCreateHomeClick}
          showButton={true}
          title="You haven't created home yet!!"
        />
      ) : (
        <>
          {!_.isEmpty(userFavoriteSwitches) && (
            <>
              <div className={classes.labelContainer}>
                <Typography variant="h4" sx={{ marginBottom: "12px" }}>
                  Favorite switches
                </Typography>
              </div>
              <div className={classes.switchListContainer}>
                {_.map(userFavoriteSwitches, (switchData) => {
                  return (
                    <SwitchCard
                      key={switchData.id}
                      switchData={switchData}
                      userFavoriteSwitchesQueryProps={
                        userFavoriteSwitchesQueryProps
                      }
                      isFavorite={true}
                      showCardOptions={false}
                    />
                  );
                })}
              </div>
            </>
          )}
          <div className={classes.labelContainer}>
            <Typography variant="h4" sx={{ marginBottom: "12px" }}>
              Homes
            </Typography>
            <Button
              onClick={onCreateHomeClick}
              variant="contained"
              size="small"
            >
              Create home
            </Button>
          </div>
          <div className={classes.homeListContainer}>
            {_.map(userHomes, (home) => {
              const { id, name, room_count, user_role } = home;
              const onCardOptionClick = (params) => {
                onOptionClick({ ...params, home });
              };
              return (
                <Card
                  className={classes.cardContainer}
                  key={id}
                  onClick={() => onCardClick({ id })}
                >
                  <CardHeader
                    action={
                      user_role == USER_ROLE_GUEST ? null : (
                        <DropDownMenu
                          options={CARD_OPTIONS}
                          onOptionClick={onCardOptionClick}
                        >
                          <IconButton>
                            <MoreVert />
                          </IconButton>
                        </DropDownMenu>
                      )
                    }
                    title={name}
                  />
                  <CardContent>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Room count: {room_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
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
          onButton1Click={handleDialogClose}
          onClose={handleDialogClose}
          button1Text="Cancel"
          button2Text="Delete"
          onButton2Click={onDeleteHome}
        />
      )}
    </div>
  );
};

export default UserHomes;
