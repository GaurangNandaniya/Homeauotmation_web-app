import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi } from "../utils/api";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";

const useFetchData = (props) => {
  const { params, path } = props;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { state } = useContext(AppContext);
  const jwtToken = _.get(state, "userInfo.token", "");
  const dependency = JSON.stringify(props);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchDataFromApi({
          path,
          requestBody: params,
          jwtToken,
        });
        setData(response.data);
      } catch (error) {
        setIsError(true);
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dependency]);

  return { data, isLoading, isError };
};

export default useFetchData;
