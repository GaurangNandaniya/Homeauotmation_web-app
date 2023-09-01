import React, { useEffect, useContext } from "react";
import AuthButtons from "./AuthButtons";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, setUserInfo } from "utils/localStorageUtils";
import { isJWTExpired } from "utils/jwtUtils";
import _ from "lodash";
import { AppContext } from "contextAPI/contextAPI";
import { HIDE_TOASTER, UPDATE_ROUTE_INFO } from "contextAPI/reducerActions";
import { Alert, Snackbar } from "@mui/material";

const RootPage = (props) => {
  const childComp = useOutlet();
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

  const onCloseToaster = () => {
    dispatch({ type: HIDE_TOASTER });
  };

  return (
    <>
      {childComp ? (
        childComp
      ) : (
        <>
          <AuthButtons />
          <h1>Homeautomation</h1>
        </>
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
    </>
  );
};

export default RootPage;
