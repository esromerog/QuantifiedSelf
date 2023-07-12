import "./App.scss";
import { useState } from 'react';
import RenderDevices, { DeviceCard } from './devices';
import Expand from './expandable';
import './dataManagement';
import DataManagement from "./dataManagement";

const eegDevices = [
  {
    heading: "Muse",
    content: <DeviceCard content="Easy-to-use bluetooth muse EEG headset"/>,
  },
  {
    heading: "Emotiv",
    content: <DeviceCard content="Emotiv EEG headset"/>,
  }
];

const data = [
{
  heading: 'EEG Devices',
  icon: "bi bi-plug",
  content: <Expand data={eegDevices} key="EEG"/>,
},
{
  heading: 'Camera',
  content: <DeviceCard content="Camera on your device"/>,
},
{
  heading: 'Microphone',
  content: <DeviceCard content="Your own device's microphone"/>,
},
];


function App() {

  const [deviceStates, setDeviceStates]=useState(data.reduce((acc, obj)=> {
    const deviceName=obj.heading;
    acc[deviceName]=false;
    return acc
  }, {}));

  function handleDeviceStates(deviceName) {
    const nextDevices={...deviceStates};
    nextDevices[deviceName]=!nextDevices[deviceName];
    setDeviceStates(nextDevices);
  }


  return (
  <div className="container ms-5 me-5">
    <div className="row row-cols-2">
      <div className="col">
        <div className="vertical-spacing">
          <h5>Data Sources</h5>
          <ul className="nav nav-underline nav-fill" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#sources">Sources</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#data-streams">Data</button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" role="tabpanel" tabindex="0" id="sources">
              <RenderDevices 
              data={data} 
              deviceStates={deviceStates} 
              handleDeviceStates={handleDeviceStates}/>
            </div>
            <div className="tab-pane fade" role="tabpanel" tabindex="0" id="data-streams">
              <DataManagement />
            </div>
          </div>
        </div>
      </div>
      <div className="col mt-2">
        <h4 className="text-left">Visualization</h4>
        <ul>
            {Object.entries(deviceStates).map(([name, state])=>
            <li key={name}>Device: {name} - {state?"Active":"Not connected"}</li>
            )}
            </ul>
      </div>
    </div>
    {/*<Expand data={data} />*/}
  </div>
  );
}

export default App;
