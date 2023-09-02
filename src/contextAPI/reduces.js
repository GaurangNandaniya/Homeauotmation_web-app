import _ from "lodash";
import {
  UPDATE_ROUTE_INFO,
  UPDATE_USER_INFO,
  SHOW_TOASTER,
  HIDE_TOASTER,
} from "./reducerActions";
import update from "immutability-helper";

export const initialValue = {
  userInfo: {},
  routeInfo: {},
  toaster: {
    isOpen: false,
    severity: "info",
    toasterStyle: { width: "100%" },
    autoHideDuration: 3000,
    message: "",
  },
};

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
    case SHOW_TOASTER: {
      const value = action.value;
      let newState = state;
      newState = update(newState, { toaster: { isOpen: { $set: true } } });
      _.forEach(value, (val, key) => {
        newState = update(newState, { toaster: { [key]: { $set: val } } });
      });
      return newState;
    }
    case HIDE_TOASTER: {
      const value = initialValue.toaster;
      let newState = state;
      _.forEach(value, (val, key) => {
        newState = update(newState, { toaster: { [key]: { $set: val } } });
      });
      return newState;
    }
    default:
      return state;
  }
};
