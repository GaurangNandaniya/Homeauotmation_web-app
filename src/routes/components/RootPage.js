import React from "react";
import AuthButtons from "./AuthButtons";
import { useOutlet } from "react-router-dom";

const RootPage = (props) => {
  const childComp = useOutlet();
  return childComp ? (
    childComp
  ) : (
    <>
      <AuthButtons />
      <h1>Homeautomation</h1>
    </>
  );
};

export default RootPage;
