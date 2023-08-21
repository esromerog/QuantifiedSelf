import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './App';
import './index.scss';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate
  } from "react-router-dom";

import ErrorPage from "./error-page";


const router = createBrowserRouter([
  {
    path: ":visID/*",
    element: <App />,
    errorElement: <ErrorPage />,
  },

]);
/*{
  path: "*",
  element: <Navigate to="/home/devices" />,
}*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
);

// <RouterProvider router={router}>

// </React.StrictMode>
