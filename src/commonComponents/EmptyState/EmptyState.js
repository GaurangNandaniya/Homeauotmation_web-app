import React from "react";
import classes from "./EmptyState.scss";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import _ from "lodash";

const EmptyState = (props) => {
  const { title, showButton, buttonText, onButtonClick } = props;
  return (
    <div className={classes.container}>
      <Typography variant={"h6"}> {title} </Typography>
      {showButton && (
        <Button
          onClick={onButtonClick}
          variant="contained"
          size="small"
          sx={{ textTransform: "none", fontSize: "1.2rem" }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};
EmptyState.defaultProps = {
  title: "Nothing here yet",
  showButton: false,
  buttonText: "Click",
  onButtonClick: _.noop,
};

export default EmptyState;
