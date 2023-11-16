import "./App.scss";
import React, { useEffect, useState } from 'react';
import { MainMenu, MainView } from "./components/ui/visuals/mainVisuals";
import visSourcesImport from './metadata/vis'
import { DeviceSelectionWindow, DataManagementWindow } from "./components/ui/devices/mainDevices";
import { Routes, Route, Navigate, useParams, Link, NavLink } from 'react-router-dom';
import { RecordComponent } from "./components/ui/recording";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';
import LSLReceiver from "./components/utility/lslClient";
import { isMobile } from 'react-device-detect';
import MobileUnavaiabilityScreen from "./components/ui/mobile";


// Some improvements that I need to make (after env):
// Maybe have the user put his license information in here (?) Otherwise do they access Cortex through our account (?)

// Another useful thing is the stream selection when in the devices tabs:
// Store data mappings on the store
// Don't stream every variable - check which ones the user has selected to only make those available in the dropdown

export const allVisSources = visSourcesImport.map(
  (visSource) => {
    if (visSource.img_src) {
      return {
        name: visSource.name,
        description: visSource.description,
        img_name: require(`./assets/${visSource.img_src}`),
        properties: visSource.properties,
        engine: visSource.engine,
        code: visSource?.code,
        id: visSource.id,
        path: visSource?.path,
      }
    }
    else {
      return {
        name: visSource.name,
        description: visSource.description,
        properties: visSource.properties,
        engine: visSource.engine,
        code: visSource?.code,
        id: visSource.id,
      }
    }
  }
);

const areThereDevices = createSelector(
  [state=>state.deviceMeta],
  (deviceMeta) => {
    return (Object.keys(deviceMeta).length>0)
  }
)

// Object where recording is temporarily stored
const saveObject = [];



function NavBar() {
  const [recording, setRecording] = useState(false);
  const areDevices = useSelector(areThereDevices);

  return (
    <nav className="navbar styled-navbar g-0 p-0 d-flex justify-content-between align-items-center">
      <a className="navbar-brand m-0 ms-4 h5" href="https://creative-quantified-self.gitbook.io/docs/" target="_blank">Quantified Self</a>
      <div className="h-100 m-0 g-0 d-flex align-items-center">
        {areDevices?<RecordComponent saveObject={saveObject} recording={recording} setRecording={setRecording} />:null}
        <NavLink className="btn" to="/devices">Devices</NavLink>
        <NavLink className="btn" to="/visuals">Visuals</NavLink>
      </div>
    </nav>
  )
}

function DesktopApp() {

  return (
    <>
      <NavBar />
      <div className="hv-100">
        <Routes>
          <Route path="/devices" element={<DeviceSelectionWindow />} />
          <Route path="/visuals" element={<MainMenu />} />
          <Route path="/visuals/:visID" element={<MainView />} />
          <Route path="/" element={<Navigate to="devices" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {

  const renderedContent = isMobile ? <MobileUnavaiabilityScreen /> : <DesktopApp />

  return(
    <>
      {renderedContent}
    </>
  )
}

// Notes

// To persist data in a sessionstorage, I could follow the tutorial
// https://www.geeksforgeeks.org/how-to-persist-redux-state-in-local-storage-without-any-external-library/
// Also featured here: https://stackoverflow.com/questions/49330546/how-to-persist-redux-state-in-the-easiest-way

// It would be session storage instead of local storage though
// To save the data from an object into a CSV, I can use papaparse
// After papaparse, I can manually save with:
// https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link

