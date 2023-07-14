import "./App.scss";
import React, { useState } from 'react';
import RenderDevices, { DeviceCard } from './devices';
import Expand from './expandable';
import './dataManagement';
import DataManagement from "./dataManagement";
import Sun from './components/sun';
import CortexComp from './components/cortex'

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

const rawVisParameters=[
  {name: "Position", value: [
      {name: "x", value: 10}, 
      {name: "y", value: 20}
  ], type: ""},
  {name: "Size", value: 0},
];


// Pasar visParameters a DataCard
const deviceDataDefault={
  Alpha: 20,
  Beta: 21,
}

function App() {

  const changeIntervalRef = React.useRef(null);

  const [visParameters, setVisParameters]=useState(rawVisParameters);

  const [deviceStream, setDeviceStream]=useState(deviceDataDefault);

  function handleValue(val) {
    setDeviceStream(val);
  }

  function UpdateValues(name1, name2, newValue) {
      setVisParameters(prevData => {
          const newData=[...prevData];
          if (name2!==name1) {
              newData.find(x => x.name===name1).value.find(x => x.name===name2).value=newValue;
          } else {
              newData.find(x => x.name===name1).value=newValue;
          }
          return newData;
      })
  }

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
            <div className="tab-pane fade show active" role="tabpanel" tabIndex="0" id="sources">
              <RenderDevices 
              data={data} 
              deviceStates={deviceStates} 
              handleDeviceStates={handleDeviceStates}/>
            </div>
            <div className="tab-pane fade" role="tabpanel" tabIndex="0" id="data-streams">
              <DataManagement deviceStream={deviceStream} updateValues={UpdateValues} visParameters={visParameters}/>
            </div>
          </div>
        </div>
      </div>
      <div className="col mt-2">
        <h4 className="text-left">Visualization</h4>
        <Sun value={visParameters[1].value}/>
        <ul>
            {Object.entries(deviceStates).map(([name, state])=>
            <li key={name}>Device: {name} - {state?"Active":"Not connected"}</li>
            )}
          </ul>
          {/*<CortexComp handleValue={handleValue} oldData={deviceStream} changeIntervalRef={changeIntervalRef}/>*/}
      </div>
    </div>
  </div>
  );
}

export default App;
