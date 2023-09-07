import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi } from "../utils/api";
import { AppContext } from "contextAPI/contextAPI";
import _ from "lodash";

const useFetchData = (props) => {
  const { params, path, queryName } = props;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [queryProps, setQueryProps] = useState({});
  const { state } = useContext(AppContext);
  const jwtToken = _.get(state, "userInfo.token", "");
  const dependency = JSON.stringify(props);

  useEffect(() => {
    const fetchData = async ({ _params = params } = {}) => {
      try {
        setIsLoading(true);
        const response = await fetchDataFromApi({
          path,
          requestBody: _params,
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

    setQueryProps({ refetch: fetchData });
    fetchData({ _params: params });
  }, [dependency, jwtToken]);

  return {
    [_.isEmpty(queryName) ? "data" : queryName]: data,
    [_.isEmpty(queryName) ? "isLoading" : `${queryName}IsLoading`]: isLoading,
    [_.isEmpty(queryName) ? "isError" : `${queryName}IsError`]: isError,
    [_.isEmpty(queryName) ? "queryProps" : `${queryName}QueryProps`]:
      queryProps,
  };
};

export default useFetchData;
