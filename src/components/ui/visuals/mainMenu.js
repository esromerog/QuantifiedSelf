import React, { useEffect } from "react";
import { CustomVisualization, DefaultVisualizations } from "./viscards";
import { Route, Routes, NavLink } from "react-router-dom";

export function MainMenu() {
  const localSources = localStorage.getItem("visuals");

  return (
    <div className="h-100 center-margin overflow-scroll disable-scrollbar">
      <div className="center-margin text-center align-items-center">
        <h4 className="mt-5 mb-2">Visuals</h4>
        <p>
          These are some of the visuals we have made or selected. <br></br>Feel
          free to modify the code, create your own visual or explore.
        </p>
      </div>
      <VisNavBar />
      <div>
        <Routes>
          <Route path="default" element={<DefaultVisualizations />} />
          <Route
            path="custom"
            element={<CustomVisualization localSources={localSources} />}
          />
        </Routes>
      </div>
    </div>
  );
}

function VisNavBar() {
  return (
    <ul className="nav nav-underline d-flex justify-content-center">
      <li className="nav-item">
        <NavLink className="nav-link" to="/visuals/custom">
          <h5>Custom</h5>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/visuals/default">
          <h5>Default</h5>
        </NavLink>
      </li>
    </ul>
  );
}
