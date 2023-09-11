import "./App.scss";
import React, { useState } from 'react';
import MainVisualsWindow from "./components/ui/visuals/mainVisuals";
import visSourcesImport from './metadata/vis'
import { DeviceSelectionWindow, DataManagementWindow } from "./components/ui/devices/mainDevices";
import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import { RecordComponent } from "./components/ui/recording";

// Some improvements that I need to make (after env):
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

/*
function lslClient(socketUrl, audioContext) {
  const socket = new WebSocket(socketUrl)

  socket.addEventListener('message', (message)=>{

      console.log(JSON.parse(message.data))
      
      //const audioBufferChunk=audioContext.decodeAudioData(message.data)
      //source = audioContext.createBufferSource();
      //source.buffer = audioBufferChunk;
      //source.connect(audioContext.destination);
      //source.start();
  })
}
*/

// Object where recording is temporarily stored (JavaScript Memory)
const saveObject = [];

function MainUI() {
  let { visID } = useParams();
  const visMetadata = allVisSources.find(x => x.name === visID);
  const [recording, setRecording] = useState(false);
  
  //const [field, setField]=useState();

  //var audioContext=new AudioContext({sampleRate: 88200});
  //lslClient("ws://localhost:8333")


  if (visMetadata===undefined&&visID!="home") {
    return <Navigate to="/home/devices" />
  } else {
    return (
      <div className="container-fluid full-width h-100">
        <div className="row full-width h-100">
          <div className="col-5 overflow-scroll disable-scrollbar h-100">
            <RecordComponent saveObject={saveObject} recording={recording} setRecording={setRecording} />
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


// Notes

// To persist data in a sessionstorage, I could follow the tutorial
// https://www.geeksforgeeks.org/how-to-persist-redux-state-in-local-storage-without-any-external-library/
// Also featured here: https://stackoverflow.com/questions/49330546/how-to-persist-redux-state-in-the-easiest-way

// It would be session storage instead of local storage though
// To save the data from an object into a CSV, I can use papaparse
// After papaparse, I can manually save with:
// https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link

