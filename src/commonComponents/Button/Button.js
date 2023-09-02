import React from "react";
import { Button as ButtonComp } from "@mui/material";

const style = { textTransform: "none", fontSize: "1.2rem" };

const Button = (props) => {
  const { children, sx } = props;
  return (
    <ButtonComp {...props} sx={{ ...style, ...sx }}>
      {children}
    </ButtonComp>
  );
};

export default Button;
