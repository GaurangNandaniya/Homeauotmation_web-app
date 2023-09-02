import React, { useContext, useState } from "react";
import { GoogleLoginWrapper, FullScreenLoader } from "commonComponents";
import { signUpUser } from "RootPage/modules/Module";
import { LoginHelpersHOC } from "HOCs";
import { SHOW_TOASTER } from "contextAPI/reducerActions";
import { AppContext } from "contextAPI/contextAPI";

const SignUp = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AppContext);

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
      dispatch({
        type: SHOW_TOASTER,
        value: {
          message: "Signup successful!",
          severity: "success",
        },
      });
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
      dispatch({
        type: SHOW_TOASTER,
        value: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  const onError = (...args) => {
    console.log(args);
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />;
    </>
  );
};

export default LoginHelpersHOC(SignUp);
