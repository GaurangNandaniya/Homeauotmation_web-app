import React, { useContext, useEffect } from "react";
import classes from "./HomeDetails.scss";
import {
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import _ from "lodash";
import { BreadCrumbs } from "commonComponents";
import { AppContext } from "contextAPI/contextAPI";
import {
  ADD_BREADCRUMS_ITEM,
  REMOVE_BREADCRUMS_ITEM,
} from "contextAPI/reducerActions";
import { Home } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { USER_ROLE_GUEST } from "constants/stringConstatnts";

const BREADCRUMB_ID = "HOME_DETAILS";

const HomeDetails = () => {
  const { userHomes } = useOutletContext();
  const { homeId = "" } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const childcomp = useOutlet({
    userHome: _.find(userHomes, (home) => home.id == homeId),
  });

  useEffect(() => {
    if (!_.some(userHomes, (home) => home.id == homeId)) {
      navigate("/");
    }
  }, [userHomes]);
  useEffect(() => {
    dispatch({
      type: ADD_BREADCRUMS_ITEM,
      value: {
        id: BREADCRUMB_ID,
        icon: <Home />,
        label: _.get(
          _.find(userHomes, (home) => home.id == homeId),
          "name",
          "Home name"
        ),
        route: `/userHomes/${homeId}`,
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

  const onAccesControlClick = () => {
    navigate("./access-controll");
  };

  const onRoomsClick = () => {
    navigate("./rooms");
  };
  if (childcomp) {
    return childcomp;
  }
  return (
    <div className={classes.container}>
      <BreadCrumbs options={state.breadCrumbs?.items} />
      <div className={classes.cards}>
        {_.get(
          _.find(userHomes, (home) => home.id == homeId),
          "user_role",
          ""
        ) == USER_ROLE_GUEST ? null : (
          <Card onClick={onAccesControlClick} className={classes.card}>
            <CardHeader title={"Home Access control"} />
          </Card>
        )}
        <Card onClick={onRoomsClick} className={classes.card}>
          <CardHeader title={"Rooms"} />
          <CardContent>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Room count:{" "}
              {_.get(
                _.find(userHomes, (home) => home.id == homeId),
                "room_count",
                "Home name"
              )}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeDetails;
