import React, { useState } from "react";
import { Box, Typography, TextField, Divider, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { GoogleLoginWrapper, FullScreenLoader, Button } from "commonComponents";
import { LoginHelpersHOC } from "HOCs";

const Login = (props) => {
  const { loginUser } = props;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const onSuccess = async ({ email, password = "", isGoogleAuth = false }) => {
    setIsLoading(true);
    await loginUser({ email, isGoogleAuth, password });
    setIsLoading(false);
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
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to control your switches.
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
              Login
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
                New here?{" "}
                <Box
                  component="span"
                  onClick={() => navigate("/signup")}
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Create an account
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginHelpersHOC(Login);
