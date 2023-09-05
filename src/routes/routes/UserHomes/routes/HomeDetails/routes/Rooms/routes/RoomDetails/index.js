import React from "react";
import RoomDetails from "./components";

const Comp = () => {
  return {
    path: ":roomId",
    element: <RoomDetails />,
  };
};
export default Comp;
