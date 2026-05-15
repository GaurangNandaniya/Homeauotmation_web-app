import React, { useContext, useState } from "react";
import { Box, Typography, TextField, Divider, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { GoogleLoginWrapper, FullScreenLoader, Button } from "commonComponents";
import { signUpUser } from "RootPage/modules/Module";
import { LoginHelpersHOC } from "HOCs";
import { SHOW_TOASTER } from "contextAPI/reducerActions";
import { AppContext } from "contextAPI/contextAPI";

const SignUp = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

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
        value: { message: "Signup successful!", severity: "success" },
      });
      setIsLoading(true);
      await loginUser({ email, isGoogleAuth, password });
      setIsLoading(false);
    } else {
      dispatch({
        type: SHOW_TOASTER,
        value: { message, severity: "error" },
      });
    }
  };

  const onError = (...args) => {
    console.log(args);
  };

  const updateUserInfo = (params) => {
    setUserInfo((prev) => ({ ...prev, ...params }));
  };

  const disabled = _.some(userInfo, (val) => _.isEmpty(val));

  return (
    <>
      {isLoading && <FullScreenLoader />}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 4,
          width: "100%",
          maxWidth: 480,
          mx: "auto",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primaryContainer",
              color: "onPrimaryContainer",
            }}
            aria-label="Back"
          >
            <ArrowBack fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
              Create account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              One account, all your homes.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              width: "100%",
              maxWidth: 320,
              mx: "auto",
            }}
          >
            <TextField
              required
              autoFocus
              size="small"
              label="First name"
              value={userInfo.firstName}
              onChange={(e) => updateUserInfo({ firstName: e.target.value })}
              fullWidth
            />
            <TextField
              required
              size="small"
              label="Last name"
              value={userInfo.lastName}
              onChange={(e) => updateUserInfo({ lastName: e.target.value })}
              fullWidth
            />
            <TextField
              required
              size="small"
              label="Email"
              type="email"
              value={userInfo.email}
              onChange={(e) => updateUserInfo({ email: e.target.value })}
              fullWidth
            />
            <TextField
              required
              size="small"
              label="Password"
              type="password"
              value={userInfo.password}
              onChange={(e) => updateUserInfo({ password: e.target.value })}
              fullWidth
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => onSuccess(userInfo)}
              disabled={disabled}
              fullWidth
            >
              Sign up
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                or
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <GoogleLoginWrapper onSuccess={onSuccess} onError={onError} />
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                Already have an account?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Log in
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginHelpersHOC(SignUp);
