import React from "react";
import classes from "./EmptyState.scss";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";
import _ from "lodash";

const EmptyState = (props) => {
  const { title, description, showButton, buttonText, onButtonClick, illustration } = props;
  return (
    <div className={classes.container}>
      {illustration && (
        <img
          src={illustration}
          alt={title}
          className={classes.illustration}
          aria-hidden="true"
        />
      )}
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className={classes.description}>
          {description}
        </Typography>
      )}
      {showButton && (
        <Button
          onClick={onButtonClick}
          variant="contained"
          size="small"
          sx={{ textTransform: "none", fontSize: "1rem", mt: 0.5 }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  illustration: PropTypes.string,
};
EmptyState.defaultProps = {
  title: "Nothing here yet",
  description: "",
  showButton: false,
  buttonText: "Click",
  onButtonClick: _.noop,
  illustration: null,
};

export default EmptyState;
