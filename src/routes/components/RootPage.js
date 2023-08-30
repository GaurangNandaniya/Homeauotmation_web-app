import React from "react";
import AuthButtons from "./AuthButtons";
import { useOutlet, useNavigate } from "react-router-dom";
import { getUserInfo } from "utils/localStorageUtils";

const RootPage = (props) => {
  const childComp = useOutlet();
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  console.log(userInfo);
  //TODO: check user info is there and JWT is there and jwt is not expired
  if (userInfo) {
    navigate("/userHomes");
  }

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
