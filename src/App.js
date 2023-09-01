import React, { useReducer } from "react";
import RootPage from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/googleLogin";
import { reducers } from "contextAPI/reduces";
import { AppContext } from "contextAPI/contextAPI";
import { initialValue } from "contextAPI/reduces";

const router = createBrowserRouter([RootPage()]);

const App = () => {
  const [state, dispatch] = useReducer(reducers, initialValue);
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContext.Provider value={{ state, dispatch }}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
