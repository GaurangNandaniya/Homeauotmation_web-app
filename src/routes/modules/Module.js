import { fetchDataFromApi } from "../../utils/api";
import { generatePassword } from "../../utils/stringUtils";

export const signUpUser = async ({ email, firstName, lastName, password }) => {
  if (!password) {
    password = generatePassword();
  }
  try {
    const response = await fetchDataFromApi({
      path: "auth/signup",
      requestBody: {
        userDetails: {
          email,
          password,
          firstName,
          lastName,
        },
      },
      // path: "noauth/state",
      // requestBody: {
      //   switchDetails: {
      //     switchId: "SWITCH_6",
      //     state: "OFF",
      //   },
      // },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async ({
  email,
  firstName,
  lastName,
  password = "",
  isGoogleAuth,
}) => {
  try {
    const response = await fetchDataFromApi({
      path: "auth/login",
      requestBody: {
        userDetails: {
          email,
          password,
          firstName,
          lastName,
          isGoogleAuth,
        },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
