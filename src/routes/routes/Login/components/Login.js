import React, { useState } from "react";
import classes from "./Login.scss";
import { GoogleLoginWrapper, FullScreenLoader, Button } from "commonComponents";
import { LoginHelpersHOC } from "HOCs";
import { TextField } from "@mui/material";

const Login = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const onSuccess = async ({ email, password = "", isGoogleAuth = false }) => {
    setIsLoading(true);
    await loginUser({
      email,
      isGoogleAuth,
      password,
    });
    setIsLoading(false);
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
            Login
          </Button>
        </div>
        <div className={classes.separator}></div>
        <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />
      </div>
    </>
  );
};

export default LoginHelpersHOC(Login);
