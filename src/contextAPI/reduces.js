import { UPDATE_ROUTE_INFO, UPDATE_USER_INFO } from "./reducerActions";
import update from "immutability-helper";

export const reducers = (state, action) => {
  switch (action.type) {
    case UPDATE_USER_INFO: {
      const value = action.value;
      return update(state, { userInfo: { $set: value } });
    }
    case UPDATE_ROUTE_INFO: {
      const value = action.value;
      return update(state, { routeInfo: { $set: value } });
    }
    default:
      return state;
  }
};
