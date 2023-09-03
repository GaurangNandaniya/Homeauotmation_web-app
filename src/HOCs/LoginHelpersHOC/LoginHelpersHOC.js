import React, { useContext } from "react";
import { loginUser } from "RootPage/modules/Module";
import { setUserInfo } from "utils/localStorageUtils";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppContext } from "contextAPI/contextAPI";
import { SHOW_TOASTER, UPDATE_USER_INFO } from "contextAPI/reducerActions";
import { fetchDataFromApi } from "utils/api";

const LoginHelpersHOC = (WrapperComp) => {
  const LoginHelpers = (props) => {
    const { dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const loginUserCall = async ({
      email,
      password = "",
      isGoogleAuth = false,
    }) => {
      const response = await loginUser({
        email,
        isGoogleAuth,
        password,
      });

      const { userId } = jwtDecode(response.token);
      const { data: userDetails } = await fetchDataFromApi({
        path: "user/userDetails",
        jwtToken: response.token,
        requestBody: {},
      });

      setUserInfo({
        userInfo: {
          userId,
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
          email,
          token: response.token,
        },
      });
      dispatch({
        type: UPDATE_USER_INFO,
        value: {
          userId,
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
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
