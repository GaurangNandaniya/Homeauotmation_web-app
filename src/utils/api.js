import axios from "axios";
import { BE_API_ENDPOIN_URL } from "../constants/apiConstant";

export const fetchDataFromApi = async ({ path, requestBody, jwtToken }) => {
  const headers = { "content-type": "application/json" };
  if (!!jwtToken) {
    headers["authorization"] = `Bearer ${jwtToken}`;
  }
  const config = {
    headers,
  };

  const data = await axios.post(
    `${BE_API_ENDPOIN_URL}${path}`,
    requestBody,
    config
  );
  return data.data;
};
