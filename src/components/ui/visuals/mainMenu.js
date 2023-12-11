
import React, { useEffect } from "react";
import RenderVisualizationCards from "./viscards";



export function MainMenu() {

    return (
      <div className="h-100 center-margin overflow-scroll disable-scrollbar">
        <div className="center-margin text-center align-items-center">
          <h4 className="mt-5 mb-2">Visuals</h4>
          <p>
            These are some of the visuals we have made or selected. <br></br>Feel
            free to modify the code, create your own visual or explore.
          </p>
        </div>
        <div>
          <RenderVisualizationCards />
        </div>
      </div>
    );
  }