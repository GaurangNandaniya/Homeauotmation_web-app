import React, { useContext, useState } from "react";
import classes from "./SignUp.scss";
import { GoogleLoginWrapper, FullScreenLoader, Button } from "commonComponents";
import { signUpUser } from "RootPage/modules/Module";
import { LoginHelpersHOC } from "HOCs";
import { SHOW_TOASTER } from "contextAPI/reducerActions";
import { AppContext } from "contextAPI/contextAPI";
import { TextField } from "@mui/material";

const SignUp = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
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
      password,
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
        isGoogleAuth,
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

  const updateUserInfo = (params) => {
    setUserInfo((prev) => ({ ...prev, ...params }));
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <div className={classes.container}>
        <div className={classes.inputContainers}>
          <TextField
            required
            autoFocus
            size="small"
            label="Enter email"
            value={userInfo.email}
            type="email"
            onChange={(e) => {
              updateUserInfo({ email: e.target.value });
            }}
          />
          <TextField
            required
            size="small"
            label="Enter First name"
            value={userInfo.firstName}
            onChange={(e) => {
              updateUserInfo({ firstName: e.target.value });
            }}
          />
          <TextField
            required
            size="small"
            label="Enter last name"
            value={userInfo.lastName}
            onChange={(e) => {
              updateUserInfo({ lastName: e.target.value });
            }}
          />
          <TextField
            required
            size="small"
            label="Enter password"
            value={userInfo.password}
            type="password"
            onChange={(e) => {
              updateUserInfo({ password: e.target.value });
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => onSuccess(userInfo)}
            disabled={_.some(userInfo, (val) => _.isEmpty(val))}
          >
            SignUp
          </Button>
        </div>
        <div className={classes.separator}></div>
        <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />
      </div>
    </>
  );
};

export default LoginHelpersHOC(SignUp);
