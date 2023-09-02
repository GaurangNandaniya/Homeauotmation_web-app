import React from "react";
import classes from "./Loader.scss";
import { CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <div className={classes.container}>
      <CircularProgress color="inherit" />
    </div>
  );
};

export default Loader;
