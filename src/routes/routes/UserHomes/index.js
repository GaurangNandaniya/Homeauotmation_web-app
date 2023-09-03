import React from "react";
import UserHomes from "./components";
import HomeDetails from "./routes/HomeDetails";

const Comp = () => {
  return {
    path: "userHomes",
    element: <UserHomes />,
    children: [HomeDetails()],
  };
};
export default Comp;
