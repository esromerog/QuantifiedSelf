import "./App.scss";
import React, { useEffect, useState } from 'react';
import RenderDevices from './devices';
import './dataManagement';
import DataManagement from "./dataManagement";
import Sun from './components/sun';

import Mirrors from './components/mirrors'
import AvailableDataInformation from "./availableData";
import {Emotiv} from "./streamFunctions";



const devicesRaw = [
{
  heading: 'Emotiv',
  description: 'EEG device developed by...',
  type: 'EEG device',
  data: [
    {name: "Alpha", description: "I'll write this later", type: "Continuous"},
    {name: "Beta", description: "Maybe I'll also write this later", type: "Continuous"},
  ]
},

{
  heading: 'Camera',
  type: 'Device Hardware',
  description: "This is your own computer's camera",
  data: [
    {name: "RGB"}
  ]
},
{
  heading: 'Microphone',
  type: "Device Hardware",
  description: "This is your own device's selected microphone",
  data: [
    {name: "Left Channel"}
  ]
},
];

const rawVisParameters=[
  {name: "Position", value: [
      {name: "x", value: 10}, 
      {name: "y", value: 20}
  ], type: ""},
  {name: "Size", value: 0},
  {name: "Another", value: 0},
];




function App() {

  const devices=[...devicesRaw];
  // Used for testing purposes


  const [visParameters, setVisParameters]=useState(rawVisParameters.reduce((acc, parameter)=>{
    if (Array.isArray(parameter.value)) {
      acc[parameter.name]=parameter.value.reduce((acc, datos)=>{acc[datos.name]=0; return acc}, {});
    } else {
      acc[parameter.name]=parameter.value;
    }
    return acc;
  }, {}));

  const [deviceStream, setDeviceStream]=useState(devices.reduce((acc, deviceSelected)=>{
    acc[deviceSelected.heading]=deviceSelected.data.reduce((acc, datos)=>{acc[datos.name]=0; return acc}, {})
    return acc;
  }, {}));

  function handleValue(val) {
    setDeviceStream(val);
  }

  
  function UpdateValues(name1, name2, newValue) {
    setVisParameters(prevData => {
          let newData=Object.assign({}, prevData);
          (name1===name2)?newData[name1]=newValue:newData[name1][name2]=newValue;
          return newData;
      })
  }
  
  const [deviceStates, setDeviceStates]=useState([...devices].reduce((acc, obj)=> {
    const deviceName=obj.heading;
    acc[deviceName]=false;
    return acc
  }, {}));

  function handleDeviceStates(deviceName) {
    const nextDevices={...deviceStates};
    nextDevices[deviceName]=!nextDevices[deviceName];
    setDeviceStates(nextDevices);
  }

  const deviceStreamFunctions={
    Emotiv: <Emotiv setDeviceActive={()=>handleDeviceStates("Emotiv")} deviceStates={deviceStates} deviceStream={deviceStream} handleValue={handleValue}/>,
  };
  /*
  useEffect(()=>{
    if (deviceStates["Muse"]) {
      CortexComp(deviceStream, handleValue);
    }}, [deviceStates["Muse"]]);*/

  const disp=()=>{
    if (!deviceStates["Emotiv"]) {
      return "Emotiv not connected"
    } else {
      return "Alpha: "+deviceStream["Emotiv"]["Alpha"]
    }
  };
  return (
  <div className="container-fluid">
    <div className="row">
      <div className="col-5">
        <div className="vertical-spacing ms-5 me-5">
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
            <div className="tab-pane show active" role="tabpanel" tabIndex="0" id="sources">
              <RenderDevices 
              data={[...devices]} 
              deviceStates={deviceStates} 
              deviceStreamFunctions={deviceStreamFunctions}/>
            </div>
            <div className="tab-pane" role="tabpanel" tabIndex="0" id="data-streams">
              {/* The active devices will be shown/programmed here*/}
              <div className="mt-3 ms-2 me-2">
                <h6>Available Data</h6>
                <p className='mb-2'>The devices are currently streaming the following data. Hover over a data source to learn more.</p>
                <AvailableDataInformation source={deviceStates} popupInfo={[...devices]}/>
              </div>
              <DataManagement deviceStream={deviceStream} deviceStates={deviceStates} updateValues={UpdateValues} visParameters={rawVisParameters} activeVisParameters={visParameters}/>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="w-100 d-block"></div>*/}
      <div className="col-7 mt-2">
        <div className="position-fixed">
          <h4 className="text-left">Visualization</h4>
          <ul>
              {Object.entries(deviceStates).map(([name, state])=>
              <li key={name}>Device: {name} - {state?"Active":"Not connected"}</li>
              )}
          </ul>
          {disp()}
          <div>
            <Mirrors value={5} min={0.5} max={5}/>
          </div>
          {/*<Sun value={visParameters["Size"]*3}/>*/}
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
