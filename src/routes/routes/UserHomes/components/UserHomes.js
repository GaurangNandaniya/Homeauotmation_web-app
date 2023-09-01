import React, { useContext, useState } from "react";
import classes from "./UserHomes.scss";
import { Alert, Snackbar } from "@mui/material";
import { AppContext } from "contextAPI/contextAPI";
import { SHOW_TOASTER } from "contextAPI/reducerActions";

const UserHomes = () => {
  const { dispatch } = useContext(AppContext);

  return (
    <div
      className={classes.container}
      onClick={() =>
        dispatch({
          type: SHOW_TOASTER,
          value: { message: "Hi gaurang!!", severity: "info" },
        })
      }
    >
      Gaurang
    </div>
  );
};

export default UserHomes;
