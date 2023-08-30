import React from "react";
import RootPage from "./components";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import UserHomes from "./routes/UserHomes";

const Comp = () => {
  return {
    path: "/",
    element: <RootPage />,
    children: [Login(), SignUp(), UserHomes()],
  };
};
export default Comp;
