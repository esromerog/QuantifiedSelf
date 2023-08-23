import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import './index.scss';
// import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// import ErrorPage from "./error-page";

import { Provider } from "react-redux";
import store from "./store";

/*
const router = createBrowserRouter([
  {
    path: ":visID/*",
    element: <App />,
    errorElement: <ErrorPage />,
  },

]);
{
  path: "*",
  element: <Navigate to="/home/devices" />,
}*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// <RouterProvider router={router}>
// <Provider>
// </React.StrictMode>
