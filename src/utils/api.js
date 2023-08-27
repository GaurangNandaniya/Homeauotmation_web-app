import axios from "axios";
import { BE_API_ENDPOIN_URL } from "../constants/apiConstant";

export const fetchDataFromApi = async ({ path, requestBody }) => {
  const data = await axios.post(`${BE_API_ENDPOIN_URL}${path}`, requestBody);
  return data.data;
};
