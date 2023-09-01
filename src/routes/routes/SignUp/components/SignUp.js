import React, { useState } from "react";
import { GoogleLoginWrapper, Loader } from "commonComponents";
import { signUpUser } from "RootPage/modules/Module";
import { LoginHelpersHOC } from "HOCs";

const SignUp = (props) => {
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
      await loginUser({
        email,
        firstName,
        isGoogleAuth,
        lastName,
        password,
      });
      setIsLoading(false);
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

export default LoginHelpersHOC(SignUp);
