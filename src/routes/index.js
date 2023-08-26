import React from "react";
import RootPage from "./components";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

const Comp = () => {
  return {
    path: "/",
    element: <RootPage />,
    children: [Login(), SignUp()],
  };
};
export default Comp;
