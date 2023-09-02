import React, { useContext, useState } from "react";
import classes from "./UserHomes.scss";
import { useFetchData } from "hooks";
import {
  DropDownMenu,
  EmptyState,
  FullScreenLoader,
  Loader,
  Modal,
} from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { creatUserHome, editUserHome } from "./modules";
import { MoreVert } from "@mui/icons-material";

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

const UserHomes = () => {
  const { state } = useContext(AppContext);
  const [homeModalMode, setHomeModalMode] = useState("");
  const [selectedHome, setSelectedHome] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const {
    data: userHomes,
    isLoading,
    queryProps,
  } = useFetchData({
    params: { userDetails: { userId: _.get(state, "userInfo.userId", "") } },
    path: "home/userHomes",
  });

  const onCreateHomeClick = () => {
    setHomeModalMode("CREATE");
  };
  const onHomeClose = () => {
    setHomeModalMode("");
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
    await queryProps.refetch();
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
        break;
    }
  };

  return (
    <div className={classes.container}>
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
          <div className={classes.labelContainer}>
            <Typography variant="h4" sx={{ marginBottom: "12px" }}>
              Homes
            </Typography>
            <Button
              onClick={onCreateHomeClick}
              variant="contained"
              size="small"
              sx={{ textTransform: "none", fontSize: "1.2rem" }}
            >
              Create home
            </Button>
          </div>
          <div className={classes.homeListContainer}>
            {_.map(userHomes, (home) => {
              const { id, name, room_count } = home;
              const onCardOptionClick = (params) => {
                onOptionClick({ ...params, home });
              };
              return (
                <Card className={classes.cardContainer} key={id}>
                  <CardHeader
                    action={
                      <DropDownMenu
                        options={CARD_OPTIONS}
                        onOptionClick={onCardOptionClick}
                      >
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </DropDownMenu>
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
        <CreateHomeModal
          mode={homeModalMode}
          onClose={onHomeClose}
          onCreate={onCreateHome}
          homeDetails={selectedHome}
        />
      )}
      {showLoader && <FullScreenLoader />}
    </div>
  );
};

export default UserHomes;

const CreateHomeModal = (props) => {
  const { onClose, onCreate, mode, homeDetails } = props;
  const [name, setName] = useState(() => {
    if (mode == "CREATE") return "";
    else return homeDetails?.name || "";
  });

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  return (
    <Modal onClose={onClose}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {mode == "CREATE" ? "Create new home" : "Edit home name"}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          <TextField
            required
            size="small"
            label="Enter home name"
            value={name}
            onChange={onNameChange}
          />
        </div>
        <footer className={classes.footer}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            size="small"
            sx={{ textTransform: "none", fontSize: "1.2rem" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onCreate({ name, mode, id: homeDetails?.id })}
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: "none", fontSize: "1.2rem" }}
          >
            {mode == "CREATE" ? "Create" : "Update"}
          </Button>
        </footer>
      </div>
    </Modal>
  );
};
