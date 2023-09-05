import React, { useState } from "react";
import classes from "./CreateEditModal.scss";
import { Button, Modal } from "commonComponents";
import { TextField, Typography } from "@mui/material";
import _ from "lodash";

const CreateEditModal = (props) => {
  const { onClose, onCreate, mode, switchDetails } = props;
  const [switchInfo, setSwitchInfo] = useState(() => {
    if (mode == "CREATE") return { microcontrollerId: "", name: "" };
    else return { microcontrollerId: "", name: switchDetails?.name || "" };
  });

  const onFieldChange = (e, key) => {
    setSwitchInfo((prev) => ({ ...prev, [key]: e.target.value }));
  };
  return (
    <Modal onClose={onClose}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {mode == "CREATE" ? "Create switches" : "Edit switch name"}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          {mode == "CREATE" ? (
            <TextField
              required
              size="small"
              label="Enter microcontroller id"
              value={switchInfo.microcontrollerId}
              onChange={(e) => onFieldChange(e, "microcontrollerId")}
            />
          ) : (
            <TextField
              required
              size="small"
              label="Enter switch name"
              value={switchInfo.name}
              onChange={(e) => onFieldChange(e, "name")}
            />
          )}
        </div>
        <footer className={classes.footer}>
          <Button onClick={onClose} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            onClick={() =>
              onCreate({
                name: switchInfo.name,
                mode,
                id: switchDetails?.id,
                microcontrollerId: switchInfo.microcontrollerId,
              })
            }
            variant="contained"
            color="success"
            size="small"
            disabled={
              mode == "CREATE"
                ? _.isEmpty(switchInfo.microcontrollerId)
                : _.isEmpty(switchInfo.name)
            }
          >
            {mode == "CREATE" ? "Create" : "Update"}
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default CreateEditModal;
