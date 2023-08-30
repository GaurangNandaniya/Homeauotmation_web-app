import React, { useState } from "react";
import { GoogleLoginWrapper, Loader } from "commonComponents";
import { signUpUser, loginUser } from "RootPage/modules/Module";
import { setUserInfo } from "utils/localStorageUtils";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSuccess = async ({
    email,
    firstName,
    lastName,
    password = "",
    isGoogleAuth = false,
  }) => {
    setIsLoading(true);
    const { success, message } = await signUpUser({
      email,
      firstName,
      lastName,
    });
    setIsLoading(false);

    if (success) {
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
    } else {
      //show error msg in toast
    }
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

export default SignUp;
