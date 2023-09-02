import React from "react";
import classes from "./Modal.scss";
import PropTypes from "prop-types";
import { Modal as ModalComp } from "@mui/material";
import _ from "lodash";

const Modal = (props) => {
  const { onClose, children, sx } = props;
  return (
    <ModalComp open={true} onClose={onClose}>
      <div className={classes.modalContainer} style={sx}>
        {children}
      </div>
    </ModalComp>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func,
  sx: PropTypes.object,
};
Modal.defaultProps = {
  onClose: _.noop,
  sx: {},
};

export default Modal;
