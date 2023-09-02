import React, { useContext, useState } from "react";
import { GoogleLoginWrapper, FullScreenLoader } from "commonComponents";
import { LoginHelpersHOC } from "HOCs";

const Login = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async ({
    email,
    firstName,
    lastName,
    password = "",
    isGoogleAuth = false,
  }) => {
    setIsLoading(true);
    await loginUser({
      email,
      firstName,
      isGoogleAuth,
      lastName,
      password,
    });
    setIsLoading(false);
  };

  const onError = (...args) => {
    console.log(args);
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />
    </>
  );
};

export default LoginHelpersHOC(Login);
