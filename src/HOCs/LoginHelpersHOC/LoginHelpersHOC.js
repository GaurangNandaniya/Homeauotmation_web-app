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
      //show toast for signup success
      //show toast for logging in

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
        value: { userId, firstName, lastName, email, token: response.token },
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

    return (
      <>
        <WrapperComp {...props} loginUser={loginUserCall} />
      </>
    );
  };

  return LoginHelpers;
};

export default LoginHelpersHOC;
