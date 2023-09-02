import React, { useContext, useState } from "react";
import classes from "./UserHomes.scss";
import { useFetchData } from "hooks";
import { EmptyState, FullScreenLoader, Loader, Modal } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { creatUserHome } from "./modules";

const UserHomes = () => {
  const { state } = useContext(AppContext);
  const [showCreatHomeModal, setShowCreatHomeModal] = useState(false);
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
    setShowCreatHomeModal(true);
  };
  const onCreateHomeClose = () => {
    setShowCreatHomeModal(false);
  };

  const onCreateHome = async ({ name }) => {
    onCreateHomeClose();
    setShowLoader(true);
    await creatUserHome({ name });
    await queryProps.refetch();
    setShowLoader(false);
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
              return (
                <Card className={classes.cardContainer} key={id}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {name}
                    </Typography>
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
      {showCreatHomeModal && (
        <CreateHomeModal onClose={onCreateHomeClose} onCreate={onCreateHome} />
      )}
      {showLoader && <FullScreenLoader />}
    </div>
  );
};

export default UserHomes;

const CreateHomeModal = (props) => {
  const { onClose, onCreate } = props;
  const [name, setName] = useState("");

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  return (
    <Modal onClose={onClose}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Create new home
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
            onClick={() => onCreate({ name })}
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: "none", fontSize: "1.2rem" }}
          >
            Create
          </Button>
        </footer>
      </div>
    </Modal>
  );
};
