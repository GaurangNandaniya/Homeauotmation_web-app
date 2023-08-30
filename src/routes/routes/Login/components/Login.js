import React, { useState } from "react";
import { GoogleLoginWrapper, Loader } from "commonComponents";
import { loginUser } from "RootPage/modules/Module";
import { setUserInfo } from "utils/localStorageUtils";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSuccess = async ({
    email,
    firstName,
    lastName,
    password = "",
    isGoogleAuth = false,
  }) => {
    //show toast for signup success
    //show toast for logging in
    setIsLoading(true);
    const response = await loginUser({
      email,
      firstName,
      isGoogleAuth,
      lastName,
      password,
    });
    setIsLoading(false);
    const { userId } = jwtDecode(response.token);
    setUserInfo({
      userInfo: { userId, firstName, lastName, email, token: response.token },
    });
    navigate("/");
  };

  const onError = (...args) => {
    console.log(args);
  };

  return (
    <>
      {isLoading && <Loader />}
      <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />;
    </>
  );
};

export default Login;
