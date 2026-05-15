import React from "react";
import PropTypes from "prop-types";
import { Modal as ModalComp, Box } from "@mui/material";
import _ from "lodash";

const Modal = (props) => {
  const { onClose, children, sx } = props;
  return (
    <ModalComp open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "calc(100% - 32px)", sm: 400 },
          maxWidth: 480,
          bgcolor: "background.paper",
          color: "text.primary",
          border: 1,
          borderColor: "divider",
          boxShadow: 24,
          borderRadius: 3,
          p: 2.5,
          ...sx,
        }}
      >
        {children}
      </Box>
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
