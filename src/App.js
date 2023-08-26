import React from "react";
import RootPage from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([RootPage()]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
