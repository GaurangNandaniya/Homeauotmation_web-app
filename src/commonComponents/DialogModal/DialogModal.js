import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import _ from "lodash";

const DialogModal = (props) => {
  const {
    onClose,
    title,
    bodytext,
    button1Text,
    button2Text,
    onButton1Click,
    onButton2Click,
  } = props;
  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {bodytext}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onButton1Click}
          variant="outlined"
          size="small"
          sx={{ textTransform: "none", fontSize: "1.2rem" }}
        >
          {button1Text}
        </Button>
        <Button
          onClick={onButton2Click}
          variant="contained"
          size="small"
          color="error"
          sx={{ textTransform: "none", fontSize: "1.2rem" }}
          autoFocus
        >
          {button2Text}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogModal.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  bodytext: PropTypes.string,
  button1Text: PropTypes.string,
  button2Text: PropTypes.string,
  onButton1Click: PropTypes.func,
  onButton2Click: PropTypes.func,
};
DialogModal.defaultProps = {
  onClose: _.noop,
  title: "Dialoge",
  bodytext: "This is body text",
  button1Text: "Button 1",
  button2Text: "Button 2",
  onButton1Click: _.noop,
  onButton2Click: _.noop,
};
export default DialogModal;
