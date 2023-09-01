import React, { useEffect, useContext } from "react";
import AuthButtons from "./AuthButtons";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { getUserInfo, setUserInfo } from "utils/localStorageUtils";
import { isJWTExpired } from "utils/jwtUtils";
import _ from "lodash";
import { AppContext } from "contextAPI/contextAPI";
import { UPDATE_ROUTE_INFO } from "contextAPI/reducerActions";

const RootPage = (props) => {
  const childComp = useOutlet();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { state, dispatch } = useContext(AppContext);

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

  return childComp ? (
    childComp
  ) : (
    <>
      <AuthButtons />
      <h1>Homeautomation</h1>
    </>
  );
};

export default RootPage;
