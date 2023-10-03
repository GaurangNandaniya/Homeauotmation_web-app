import _ from "lodash";
import { fetchDataFromApi } from "utils/api";
import { getUserInfo } from "utils/localStorageUtils";

export const checkUserHomeAvailibility = async ({ email, homeId }) => {
  const { token } = getUserInfo();
  try {
    const result = await fetchDataFromApi({
      jwtToken: token,
      path: "home/check-user-home-availibility",
      requestBody: {
        userDetails: {
          email,
        },
        homeDetails: {
          id: homeId,
        },
      },
    });
    return _.get(result, "data", {});
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const addUserHomeAccess = async ({ userHomeRoleDetails }) => {
  const { token } = getUserInfo();
  try {
    const result = await fetchDataFromApi({
      jwtToken: token,
      path: "home/create-home-user-role",
      requestBody: {
        userHomeRoleDetails,
      },
    });
    return _.get(result, "data", {});
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const removeUserHomeAccess = async ({ userHomeRoleDetails }) => {
  const { token } = getUserInfo();
  try {
    const result = await fetchDataFromApi({
      jwtToken: token,
      path: "home/remove-home-user-role",
      requestBody: {
        userHomeRoleDetails,
      },
    });
    return _.get(result, "data", {});
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const updateUserHomeAccess = async ({ userHomeRoleDetails }) => {
  const { token } = getUserInfo();
  try {
    const result = await fetchDataFromApi({
      jwtToken: token,
      path: "home/update-home-user-role",
      requestBody: {
        userHomeRoleDetails,
      },
    });
    return _.get(result, "data", {});
  } catch (e) {
    console.log(e);
    return false;
  }
};
