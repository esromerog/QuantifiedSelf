import "./App.scss";
import React from 'react';
import MainVisualsWindow from "./components/ui/visuals/mainVisuals";
import visSourcesImport from './metadata/vis'
import { DeviceSelectionWindow, DataManagementWindow } from "./components/ui/devices/mainDevices";
import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';

export const allVisSources = visSourcesImport.map(
  (visSource) => {
    return {
      name: visSource.name,
      description: visSource.description,
      img_name: require(`./assets/${visSource.img_src}`),
      properties: visSource.properties
    }
  });


function MainUI() {
  let { visID } = useParams();
  const visMetadata = allVisSources.find(x => x.name === visID);

  if (visMetadata===undefined&&visID!="home") {
    return <Navigate to="/home/devices" />
  } else {
    return (
      <div className="container-fluid full-width h-100">
        <div className="row full-width h-100">
          <div className="col-5 overflow-scroll disable-scrollbar h-100">
            <div className="vertical-spacing ms-5 me-5">
              <Outlet />
            </div>
            {/*<div className="d-flex justify-content-end me-5">
          <button className="btn btn-link" alt="Pop into another window" onClick={()=>setToggleOtherScreen(true)}><i className="bi bi-box-arrow-up-right"></i></button></div>*/}
          </div>
          <div className="col-7 full-width h-100 ">
            <MainVisualsWindow visMetadata={visMetadata}/>
          </div>
        </div>
      </div>
    )
  }
}

export default function App() {

  return (
    <Routes>
      <Route path=":visID/*" element={<MainUI />}>
        <Route path="devices" element={<DeviceSelectionWindow />} />
        <Route path="data" element={<DataManagementWindow />} />
      </Route>
      <Route path="/" element={<Navigate to="home/devices"/>} />
    </Routes>
  );
}

