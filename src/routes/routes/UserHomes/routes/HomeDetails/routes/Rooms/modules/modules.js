import { fetchDataFromApi } from "utils/api";
import { getUserInfo } from "utils/localStorageUtils";

export const creatHomeRoom = async ({ name, homeId }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "room/create",
      requestBody: {
        roomDetails: {
          name,
          homeId,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const editHomeRoom = async ({ name, id }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "room/update",
      requestBody: {
        roomDetails: {
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

export const deleteHomeRoom = async ({ id }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "room/remove",
      requestBody: {
        roomDetails: {
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
