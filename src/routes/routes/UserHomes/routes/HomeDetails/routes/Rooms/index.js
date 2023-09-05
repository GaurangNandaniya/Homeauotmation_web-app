import React from "react";
import Rooms from "./components";
import RoomDetails from "./routes/RoomDetails";

const Comp = () => {
  return {
    path: "rooms",
    element: <Rooms />,
    children: [RoomDetails()],
  };
};
export default Comp;
