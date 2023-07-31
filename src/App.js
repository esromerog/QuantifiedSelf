import "./App.scss";
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import RenderDevices from './components/ui/devices/devices';
import './components/ui/visuals/dataManagement';
import DataManagement from "./components/ui/visuals/dataManagement";
import Sun from './components/visuals/sun';
import Mirrors from "./components/visuals/mirrors";
import {FullScreen, useFullScreenHandle} from 'react-full-screen'


import RenderVisualizationCards from "./components/ui/visuals/viscards";
import AvailableDataInformation from "./components/ui/devices/availableData";
import {Emotiv} from "./components/ui/devices/streamFunctions";




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

/*
const selectedVisParams=[
  {name: "Position", value: [
      {name: "x", value: 10}, 
      {name: "y", value: 20}
  ], type: ""},
  {name: "Size", value: 0},
  {name: "Another", value: 0},
];
*/



function App() {

  const devices=[...devicesRaw];
  // Used for testing purposes

  const [selectedVisParams, setSelectedVisParams]=useState({});

  

  const [visParameters, _setVisParameters]=useState({});

  

  //const [visParameters, _setVisParameters]=useState({});


  const visParametersRef=React.useRef(visParameters);

  function setVisParameters(data) {
    _setVisParameters(data);
    visParametersRef.current=visParameters;
  }

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


  const visStreamFunctions={
    "Sun Visualization": <Sun value={visParametersRef}/>,
    "Abstract Colors": <Mirrors value={visParametersRef}/>,
  };


  const disp=()=>{
    if (!deviceStates["Emotiv"]) {
      return "Emotiv not connected"
    } else {
      return "Alpha: "+deviceStream["Emotiv"]["Alpha"]
    }
  };

  const [mainMenu, setMainMenu]=useState(true);

  function returnToMainMenu() {
    setMainMenu(true);
    setVisParameters({});
    setSelectedVisParams({});
  }


  const fullScreenHandle=useFullScreenHandle();

  return (
  <div className="container-fluid h-100">
    <div className="row h-100">
      <div className="col-5 overflow-scroll disable-scrollbar h-100">
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
              {/*(selectedVisParams)*/}
              <DataManagement deviceStream={deviceStream} deviceStates={deviceStates} updateValues={UpdateValues} visParameters={selectedVisParams} activeVisParameters={visParameters}/>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="w-100 d-block"></div>*/}
      <div className="col-7 mt-2 h-100 overflow-hidden">
        <button onClick={fullScreenHandle.enter}>Full Screen</button>
          <div className="d-flex justify-content-between">
          <h4 className="text-left">Visualization</h4><button className="btn btn-primary" onClick={returnToMainMenu}>Back</button>
          </div>
          <ul>
              {Object.entries(deviceStates).map(([name, state])=>
              <li key={name}>Device: {name} - {state?"Active":"Not connected"}</li>
              )}
          </ul>
          {disp()}
          <FullScreen handle={fullScreenHandle} className="h-100">
            <div className="h-100 w-100">
              {function renderStream() {
                if (mainMenu) {
                  return <RenderVisualizationCards setVisParameters={setVisParameters} setSelectedVisParams={setSelectedVisParams} setMainMenu={setMainMenu}/>;
                } else if (!(Object.keys(visParametersRef.current).length === 0)) {
                  return visStreamFunctions[selectedVisParams.name];
                } else {
                  setVisParameters(visParameters);
                }
              }()}
            </div>
          </FullScreen>  
      </div>
    </div>
  </div>

  );
}

export default App;
