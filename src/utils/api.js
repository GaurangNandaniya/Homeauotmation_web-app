import axios from "axios";
import { API_ENDPOIN_URL } from "../constants/apiConstant";

export const fetchDataFromApi = async ({ path, requestBody }) => {
  const data = await axios.post(`${API_ENDPOIN_URL}${path}`, requestBody);
};
