const setInfoInLocalStorage = ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getInfoFromLocalStorage = ({ key }) => {
  return JSON.parse(localStorage.getItem(key));
};

export const setUserInfo = ({ userInfo }) => {
  setInfoInLocalStorage({ key: "userInfo", value: userInfo });
};

export const getUserInfo = () => {
  return getInfoFromLocalStorage({ key: "userInfo" });
};

export const setUserRoute = ({ routeInfo }) => {
  setInfoInLocalStorage({ key: "routeInfo", value: routeInfo });
};

export const getUserRouteInfo = () => {
  return getInfoFromLocalStorage({ key: "routeInfo" });
};
