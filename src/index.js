import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import './index.scss';
// import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// import ErrorPage from "./error-page";

import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter } from 'react-router-dom';

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
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// <RouterProvider router={router}>
// <Provider>
// </React.StrictMode>
