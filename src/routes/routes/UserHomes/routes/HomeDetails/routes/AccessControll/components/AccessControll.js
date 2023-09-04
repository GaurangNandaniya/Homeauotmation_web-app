import React, { useContext, useEffect } from "react";
import classes from "./AccessControll.scss";
import { BreadCrumbs } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import { AdminPanelSettingsRounded } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
const BREADCRUMB_ID = "ACCESS_CONTROLL";

const AccessControll = () => {
  const { state, dispatch } = useContext(AppContext);
  const { userHome } = useOutletContext();
  useEffect(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <AdminPanelSettingsRounded />,
        label: "Access controll",
        route: `/userHomes/${userHome.id}/access-controll`,
      },
    });
    return () => {
      dispatch({
        type: REMOVE_BREADCRUMS_ITEM,
        value: {
          id: BREADCRUMB_ID,
        },
      });
    };
  }, []);
  return (
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} />
    </div>
  );
};

export default AccessControll;
