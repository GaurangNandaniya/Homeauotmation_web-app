import React, { useState } from "react";
import classes from "./CreateEditModal.scss";
import { Button, Modal, DeviceTypePicker } from "commonComponents";
import { TextField, Typography, Box } from "@mui/material";
import _ from "lodash";
import { DEFAULT_DEVICE_TYPE } from "constants/deviceTypes";

const CreateEditModal = (props) => {
  const { onClose, onCreate, mode, switchDetails } = props;
  const isEdit = mode === "EDIT";

  const [switchInfo, setSwitchInfo] = useState(() => {
    if (isEdit) {
      return {
        microcontrollerId: "",
        name: switchDetails?.name || "",
        type: switchDetails?.type || DEFAULT_DEVICE_TYPE,
      };
    }
    return { microcontrollerId: "", name: "", type: DEFAULT_DEVICE_TYPE };
  });

  const onFieldChange = (key, value) => {
    setSwitchInfo((prev) => ({ ...prev, [key]: value }));
  };

  const submitDisabled = isEdit
    ? _.isEmpty(switchInfo.name)
    : _.isEmpty(switchInfo.microcontrollerId);

  return (
    <Modal onClose={onClose}>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <Typography variant="h3">
            {isEdit ? "Edit switch" : "Create switches"}
          </Typography>
        </div>
        <div className={classes.inputContainer}>
          {isEdit ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                required
                size="small"
                label="Switch name"
                value={switchInfo.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                fullWidth
              />
              <DeviceTypePicker
                value={switchInfo.type}
                onChange={(val) => onFieldChange("type", val)}
              />
            </Box>
          ) : (
            <TextField
              required
              size="small"
              label="Microcontroller id"
              value={switchInfo.microcontrollerId}
              onChange={(e) => onFieldChange("microcontrollerId", e.target.value)}
              fullWidth
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
                type: switchInfo.type,
              })
            }
            variant="contained"
            size="small"
            disabled={submitDisabled}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default CreateEditModal;
