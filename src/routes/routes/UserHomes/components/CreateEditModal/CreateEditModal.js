import React, { useState } from "react";
import classes from "./CreateEditModal.scss";
import { Modal } from "commonComponents";
import { Button, TextField, Typography } from "@mui/material";

const CreateEditModal = (props) => {
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

export default CreateEditModal;
