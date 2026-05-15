import React, { useEffect, useContext, useState } from "react";
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
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { LoginHelpersHOC } from "HOCs";
import { Button, FullScreenLoader, SettingsSheet } from "commonComponents";

const RootPage = (props) => {
  const { logoutUser } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const childComp = useOutlet({ openSettings: () => setSettingsOpen(true) });

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { state, dispatch } = useContext(AppContext);
  const { toaster } = state;
  const { isOpen, severity, toasterStyle, autoHideDuration, message } = toaster;

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

  const onCloseToaster = () => dispatch({ type: HIDE_TOASTER });

  const onLogoutUser = async () => {
    setSettingsOpen(false);
    setIsLoading(true);
    await logoutUser();
    setIsLoading(false);
  };

  const onSignupClick = () => navigate("/signup");
  const onLoginClick = () => navigate("/login");

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {childComp ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {childComp}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              px: 3,
              gap: 4,
              maxWidth: 480,
              mx: "auto",
              width: "100%",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h1" sx={{ mb: 1 }}>
                Home-Automation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Control every switch from one place.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                width: "100%",
                maxWidth: 320,
              }}
            >
              <Button
                onClick={onLoginClick}
                variant="contained"
                size="large"
                fullWidth
              >
                Login
              </Button>
              <Button
                onClick={onSignupClick}
                variant="outlined"
                size="large"
                fullWidth
              >
                Sign up
              </Button>
            </Box>
          </Box>
        )}

        <SettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onLogout={onLogoutUser}
        />

        <Snackbar
          open={isOpen}
          autoHideDuration={autoHideDuration}
          onClose={onCloseToaster}
        >
          <Alert onClose={onCloseToaster} severity={severity} sx={toasterStyle}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
      {isLoading && <FullScreenLoader />}
    </>
  );
};

export default LoginHelpersHOC(RootPage);
