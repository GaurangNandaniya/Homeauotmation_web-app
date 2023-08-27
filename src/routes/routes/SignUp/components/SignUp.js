import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { signUpUser } from "../../../modules/Module";

const SignUp = () => {
  const onSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    signUpUser({
      email: decoded?.email,
      firstName: decoded?.given_name,
      lastName: decoded?.family_name,
    });
  };

  const onError = (...args) => {
    console.log(args);
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap={true}
      theme="filled_black"
    />
  );
};

export default SignUp;
