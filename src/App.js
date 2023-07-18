import "./App.scss";
import React, { useEffect, useState } from 'react';
import RenderDevices from './devices';
import './dataManagement';
import DataManagement from "./dataManagement";
import Sun from './components/sun';
import CortexComp from './components/cortex';
import AvailableDataInformation from "./availableData";



// Pasar visParameters a DataCard

const devices = [
{
  heading: 'Muse',
  data: [
    {name: "Alpha", description: "I'll write this later"},
    {name: "Beta", description: "Maybe I'll also write this later"},
  ]
},

{
  heading: 'Camera',
  data: [
    {name: "RGB"}
  ]
},
{
  heading: 'Microphone',
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
];




function App() {

  // Used for testing purposes
  const changeIntervalRef = React.useRef(null);

  const [visParameters, setVisParameters]=useState(rawVisParameters);

  const [deviceStream, setDeviceStream]=useState({});

  
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

  const [deviceStates, setDeviceStates]=useState(devices.reduce((acc, obj)=> {
    const deviceName=obj.heading;
    acc[deviceName]=false;
    return acc
  }, {}));

  function handleDeviceStates(deviceName) {
    const nextDevices={...deviceStates};
    nextDevices[deviceName]=!nextDevices[deviceName];

    console.log(deviceStream);
    const newDataStream=Object.assign({}, deviceStream)
    
    // Add new device to streaming array
    if (nextDevices[deviceName]) {
      const deviceSelected=devices.find(x=>x.heading===deviceName);
      newDataStream[deviceSelected.heading]=deviceSelected.data.reduce((acc, datos)=>{acc[datos.name]=0; return acc}, {});
    } else { // Remove device from streaming array
      delete newDataStream[deviceName];
    }

    setDeviceStream(newDataStream);
    setDeviceStates(nextDevices);
  }

  function selectedStreams() {
    if(deviceStates["Muse"]) {
      return (<CortexComp handleValue={handleValue} oldData={deviceStream} changeIntervalRef={changeIntervalRef}/>);
    } else {
      clearInterval(changeIntervalRef.current);
      return null;
    }
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
            <div className="tab-pane show active" role="tabpanel" tabIndex="0" id="sources">
              <RenderDevices 
              data={devices} 
              deviceStates={deviceStates} 
              handleDeviceStates={handleDeviceStates}/>
            </div>
            <div className="tab-pane" role="tabpanel" tabIndex="0" id="data-streams">
              {/* The active devices will be shown/programmed here*/}
              <AvailableDataInformation source={deviceStates} popupInfo={devices}/>
              <DataManagement deviceStream={deviceStream} updateValues={UpdateValues} visParameters={visParameters}/>
            </div>
          </div>
        </div>
      </div>
      <div className="col mt-2">
        <h4 className="text-left">Visualization</h4>
        {/*<Sun value={visParameters[1].value}>*/}
        <ul>
            {Object.entries(deviceStates).map(([name, state])=>
            <li key={name}>Device: {name} - {state?"Active":"Not connected"}</li>
            )}
          </ul>
          {selectedStreams()}
      </div>
    </div>
  </div>
  );
}

export default App;
