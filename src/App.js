import "./App.scss";
import React, { useState } from 'react';
import MainVisualsWindow from "./components/ui/visuals/mainVisuals";
import visSourcesImport from './metadata/vis'
import { DeviceSelectionWindow, DataManagementWindow } from "./components/ui/devices/mainDevices";
import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';


// Some improvements that I need to make (ASAP):
// Add an .env file or a way to hide licenses (cough, cough, EMOTIV)
// Maybe have the user put his license information in here (?) Otherwise do they access Cortex through our account (?)

// Another useful thing is the stream selection when in the devices tabs:
// Don't stream every variable - check which ones the user has selected to only make those available in the dropdown

export const allVisSources = visSourcesImport.map(
  (visSource) => {
    return {
      name: visSource.name,
      description: visSource.description,
      img_name: require(`./assets/${visSource.img_src}`),
      properties: visSource.properties
    }
  });


function lslClient(socketUrl, audioContext) {
  const socket = new WebSocket(socketUrl)
  socket.binaryType = "arraybuffer";
  socket.addEventListener('message', (message)=>{
      const view = new Int32Array(message.data);
      console.log(view)
      
      //const audioBufferChunk=audioContext.decodeAudioData(message.data)
      //source = audioContext.createBufferSource();
      //source.buffer = audioBufferChunk;
      //source.connect(audioContext.destination);
      //source.start();
  })
}


function MainUI() {
  let { visID } = useParams();
  const visMetadata = allVisSources.find(x => x.name === visID);
  //const [field, setField]=useState();

  //var audioContext=new AudioContext({sampleRate: 88200});
  lslClient("ws://localhost:8333")


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
