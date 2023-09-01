import React, { useContext } from "react";
import { loginUser } from "RootPage/modules/Module";
import { setUserInfo } from "utils/localStorageUtils";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppContext } from "contextAPI/contextAPI";
import { SHOW_TOASTER, UPDATE_USER_INFO } from "contextAPI/reducerActions";

const LoginHelpersHOC = (WrapperComp) => {
  const LoginHelpers = (props) => {
    const { dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const loginUserCall = async ({
      email,
      firstName,
      lastName,
      password = "",
      isGoogleAuth = false,
    }) => {
      const response = await loginUser({
        email,
        firstName,
        isGoogleAuth,
        lastName,
        password,
      });

      const { userId } = jwtDecode(response.token);
      setUserInfo({
        userInfo: { userId, firstName, lastName, email, token: response.token },
      });
      dispatch({
        type: UPDATE_USER_INFO,
        value: {
          userId,
          firstName,
          lastName,
          email,
          token: response.token,
          isLoggedIn: true,
        },
      });
      navigate("/");
      dispatch({
        type: SHOW_TOASTER,
        value: {
          message: "Logged in successfully!",
          severity: "success",
        },
      });
    };

    const onLogoutUser = () => {
      setUserInfo({
        userInfo: {},
      });
      dispatch({
        type: SHOW_TOASTER,
        value: {
          message: "Logged out successfully!",
          severity: "success",
        },
      });
      dispatch({
        type: UPDATE_USER_INFO,
        value: {},
      });
      navigate("/");
    };

    return (
      <>
        <WrapperComp
          {...props}
          loginUser={loginUserCall}
          logoutUser={onLogoutUser}
        />
      </>
    );
  };

  return LoginHelpers;
};

export default LoginHelpersHOC;
