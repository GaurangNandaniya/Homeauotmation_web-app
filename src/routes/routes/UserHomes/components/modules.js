import { fetchDataFromApi } from "utils/api";
import { getUserInfo } from "utils/localStorageUtils";

export const creatUserHome = async ({ name }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "home/create",
      requestBody: {
        homeDetails: {
          name,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const editUserHome = async ({ name, id }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "home/update",
      requestBody: {
        homeDetails: {
          name,
          id,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
