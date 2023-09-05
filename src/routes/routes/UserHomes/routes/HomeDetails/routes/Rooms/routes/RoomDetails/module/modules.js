import { fetchDataFromApi } from "utils/api";
import { getUserInfo } from "utils/localStorageUtils";

export const creatSwitches = async ({ roomId, microcontrollerId }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "switch/create",
      requestBody: {
        switchDetails: {
          roomId,
          microcontrollerId,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const editRoomSwitch = async ({ name, id }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "switch/update",
      requestBody: {
        switchDetails: {
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

export const deleteRoomSwitch = async ({ id }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "switch/remove",
      requestBody: {
        switchDetails: {
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
export const updateSwitchState = async ({ id, state }) => {
  const { token } = getUserInfo();
  try {
    await fetchDataFromApi({
      jwtToken: token,
      path: "switch/state",
      requestBody: {
        switchDetails: {
          id,
          state,
        },
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getUpdatedState = (state) => {
  return state == "ON" ? "OFF" : "ON";
};
