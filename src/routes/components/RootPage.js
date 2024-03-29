import React, { useEffect, useContext, useState } from "react";
import classes from "./RootPage.scss";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, setUserInfo } from "utils/localStorageUtils";
import { isJWTExpired } from "utils/jwtUtils";
import _ from "lodash";
import { AppContext } from "contextAPI/contextAPI";
import {
  HIDE_TOASTER,
  UPDATE_ROUTE_INFO,
  UPDATE_USER_INFO,
} from "contextAPI/reducerActions";
import { Alert, AppBar, Snackbar, Typography } from "@mui/material";
import { LoginHelpersHOC } from "HOCs";
import { Button, FullScreenLoader } from "commonComponents";

const RootPage = (props) => {
  const { logoutUser } = props;

  const childComp = useOutlet();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { state, dispatch } = useContext(AppContext);

  const { toaster } = state;
  const { isOpen, severity, toasterStyle, autoHideDuration, message } = toaster;

  const isLoggedIn = _.get(state, "userInfo.isLoggedIn", false);
  const userFirstName = _.get(state, "userInfo.firstName", "User");

  useEffect(() => {
    const userInfo = getUserInfo();
    const routes = _.filter(
      _.split(pathname, "/"),
      (item) => !_.isEmpty(item) && !_.includes(["signup", "login"], item)
    );

    if (userInfo && userInfo.token && !isJWTExpired(userInfo.token)) {
      dispatch({
        type: UPDATE_USER_INFO,
        value: { ...userInfo, isLoggedIn: true },
      });
      const routeBeforeLogin = _.get(state, "routeInfo.routeBeforeLogin", "");

      if (!_.isEmpty(routeBeforeLogin)) {
        navigate(routeBeforeLogin);
      } else if (_.size(routes) == 0) {
        navigate("/userHomes");
      } else {
        // navigate(pathname);
      }
    } else {
      setUserInfo({ userInfo: {} });

      if (_.size(routes) > 0) {
        if (!_.get(state, "routeInfo.isRouteBeforeLoginAdded", false)) {
          dispatch({
            type: UPDATE_ROUTE_INFO,
            value: {
              routeBeforeLogin: pathname,
              isRouteBeforeLoginAdded: true,
            },
          });
        }
        navigate("/login");
      }
    }
  }, [pathname]);

  const onCloseToaster = () => {
    dispatch({ type: HIDE_TOASTER });
  };

  const onLogoutUser = async () => {
    setIsLoading(true);
    await logoutUser();
    setIsLoading(false);
  };

  const onSignupClick = () => {
    navigate("/signup");
  };
  const onLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <div className={classes.container}>
        {isLoggedIn && (
          <AppBar position="static">
            <div className={classes.headerContainer}>
              <Typography
                variant="h6"
                component="div"
                sx={{ display: "flex", flexGrow: 1, alignItems: "center" }}
              >
                {`Hi, ${userFirstName}`}
              </Typography>
              <Button
                color="inherit"
                className={classes.logOutButton}
                onClick={onLogoutUser}
                style={{ marginLeft: "auto" }}
              >
                Logout
              </Button>
            </div>
          </AppBar>
        )}
        {childComp ? (
          <div className={classes.childComp}>{childComp}</div>
        ) : (
          <div className={classes.loginSignupcontainer}>
            <div className={classes.headingLabelContainer}>
              <Typography variant="h3">Home-Automation</Typography>
            </div>
            <div className={classes.signupContainer}>
              <Typography variant="h6">New here! Click on Signup</Typography>
              <Button onClick={onSignupClick} variant="contained" size="small">
                Signup
              </Button>
            </div>
            <div className={classes.separator}></div>
            <div className={classes.signupContainer}>
              <Typography variant="h6">
                Already a User! Click on Login
              </Typography>
              <Button onClick={onLoginClick} variant="contained" size="small">
                Login
              </Button>
            </div>
          </div>
        )}
        <Snackbar
          open={isOpen}
          autoHideDuration={autoHideDuration}
          onClose={onCloseToaster}
        >
          <Alert onClose={onCloseToaster} severity={severity} sx={toasterStyle}>
            {message}
          </Alert>
        </Snackbar>
      </div>
      {isLoading && <FullScreenLoader />}
    </>
  );
};

export default LoginHelpersHOC(RootPage);
