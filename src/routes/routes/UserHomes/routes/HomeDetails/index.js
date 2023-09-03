import React from "react";
import HomeDetails from "./components";
import AccessControll from "./routes/AccessControll";
import Rooms from "./routes/Rooms";

const Comp = () => {
  return {
    path: ":homeId",
    element: <HomeDetails />,
    children: [AccessControll(), Rooms()],
  };
};
export default Comp;
