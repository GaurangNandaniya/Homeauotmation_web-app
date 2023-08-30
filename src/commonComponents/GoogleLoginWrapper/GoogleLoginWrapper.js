import React from "react";
import jwtDecode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import PropTypes from "prop-types";
import _ from "lodash";

const GoogleLoginWrapper = (props) => {
  const { onError, onSuccess } = props;

  const onSuccessCallback = (response) => {
    const decoded = jwtDecode(response.credential);
    onSuccess({
      email: decoded?.email,
      firstName: decoded?.given_name,
      lastName: decoded?.family_name,
      password: "0000",
      isGoogleAuth: true,
    });
  };

  const onErrorCallback = (response) => {
    onError(response);
  };

  return (
    <GoogleLogin
      onSuccess={onSuccessCallback}
      onError={onErrorCallback}
      useOneTap={true}
      theme="filled_black"
    />
  );
};

GoogleLoginWrapper.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

GoogleLoginWrapper.defaultProps = {
  onSuccess: _.noop,
  onError: _.noop,
};

export default GoogleLoginWrapper;
