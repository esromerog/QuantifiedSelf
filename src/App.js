import "./App.scss";
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import RenderDevices from './components/ui/devices/devices';
import './components/ui/visuals/dataManagement';
import DataManagement from "./components/ui/visuals/dataManagement";
import Sun from './components/visuals/sun';
import Mirrors from "./components/visuals/mirrors";
import { FullScreen, useFullScreenHandle } from 'react-full-screen'


import RenderVisualizationCards from "./components/ui/visuals/viscards";
import AvailableDataInformation from "./components/ui/devices/availableData";
import { Emotiv } from "./components/ui/devices/streamFunctions";
// import ReactCSSTransitionGroup from 'react-transition-group';



const devicesRaw = [
  {
    heading: 'Emotiv',
    description: 'EEG device developed by...',
    type: 'EEG device',
    data: [
      { name: "Alpha", description: "I'll write this later", type: "EEG Data"},
      { name: "Beta", description: "Maybe I'll also write this later"},
      { name: "Gyro", description: "Gyroscope data for the EMOTIV headset"}
    ]
  },

  {
    heading: 'Camera',
    type: 'Device Hardware',
    description: "This is your own computer's camera",
    data: [
      { name: "RGB" }
    ]
  },
  {
    heading: 'Microphone',
    type: "Device Hardware",
    description: "This is your own device's selected microphone",
    data: [
      { name: "Left Channel" }
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

  const devices = [...devicesRaw];
  // Used for testing purposes

  const [selectedVisParams, setSelectedVisParams] = useState({}); // Contains the parameters of the visualization currently in use

  const [visParameters, _setVisParameters] = useState({}); // The one that is actually changing & mapped to data stream

  //const [visParameters, _setVisParameters]=useState({});


  const visParametersRef = React.useRef(visParameters);

  function setVisParameters(data) {
    _setVisParameters(data);
    visParametersRef.current = visParameters;
  }

  const [deviceStream, setDeviceStream] = useState(devices.reduce((acc, deviceSelected) => {
    acc[deviceSelected.heading] = deviceSelected.data.reduce((acc, datos) => { acc[datos.name] = 0; return acc }, {})
    return acc;
  }, {}));


  function handleValue(val) {
    setDeviceStream(val);
  }


  function UpdateValues(name1, name2, newValue) {
    setVisParameters(prevData => {
      let newData = Object.assign({}, prevData);
      (name1 === name2) ? newData[name1] = newValue : newData[name1][name2] = newValue;
      return newData;
    })
  }

  const [deviceStates, setDeviceStates] = useState([...devices].reduce((acc, obj) => {
    const deviceName = obj.heading;
    acc[deviceName] = false;
    return acc
  }, {}));


  
  function handleDeviceStates(deviceName) {
    const nextDevices = { ...deviceStates };
    nextDevices[deviceName] = !nextDevices[deviceName];
    setDeviceStates(nextDevices);
  }

  const deviceStreamFunctions = {
    Emotiv: <Emotiv setDeviceActive={() => handleDeviceStates("Emotiv")} deviceStates={deviceStates} deviceStream={deviceStream} handleValue={handleValue} />,
  };


  const visStreamFunctions = {
    "Sun Visualization": <Sun value={visParametersRef} />,
    "Abstract Colors": <Mirrors value={visParametersRef} />,
  };


  const disp = () => {
    if (!deviceStates["Emotiv"]) {
      return "Emotiv not connected"
    } else {
      return "Alpha: " + deviceStream["Emotiv"]["Alpha"]
    }
  };

  const [mainMenu, setMainMenu] = useState(true);

  function returnToMainMenu() {
    setMainMenu(true);
    setVisParameters({});
    setSelectedVisParams({});
  }

  const [toggleData, setToggleData] = useState(false);

  const fullScreenHandle = useFullScreenHandle();



  return (
    <div className="container-fluid full-width h-100">
      <div className="row full-width h-100">
        <div className="col-5 overflow-scroll disable-scrollbar h-100">
          <div className="vertical-spacing ms-5 me-5">
            {!toggleData?
              <div>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0 pb-2 pt-2">Data Sources</h5>
                {(!mainMenu)?
                <button className="btn btn-link text-decoration-none" onClick={()=>setToggleData(true)}>
                  <small className="m-0 ">Data Management  </small><i className="bi bi-arrow-right" alt="Go to data management"></i>
                </button>:null}
              </div>
              <div>
                <RenderDevices
                  data={[...devices]}
                  deviceStates={deviceStates}
                  deviceStreamFunctions={deviceStreamFunctions} />
              </div>
            </div>:
            <div>
              <div className="d-flex align-items-center">
                <button className="btn btn-link ps-0 pt-0 pb-0" onClick={()=>setToggleData(false)}><i className="bi bi-chevron-left m-0" alt="Back to devices"></i></button>
                <h5 className="m-0">Data Management</h5>
              </div>
              <div className="mt-3">
                <h6>Available Data</h6>
                <p className='mb-2'>The devices are currently streaming the following data. Hover over a data source to learn more.</p>
                <AvailableDataInformation source={deviceStates} popupInfo={[...devices]} />
              </div> {!(mainMenu)?
              <DataManagement deviceStream={deviceStream} deviceStates={deviceStates} updateValues={UpdateValues} visParameters={selectedVisParams} activeVisParameters={visParameters} />:null}
            </div>
          }
          </div>
        </div>
        {/*<div className="w-100 d-block"></div>*/}
        <div className="col-7 full-width h-100">
          <div className={!(mainMenu)?"h-100": "vertical-center"}>
            <div className="d-flex justify-content-between align-items-center align-text-center mt-1">
              <div className="d-flex align-items-center">
                {(mainMenu) ? null : <button className="btn btn-link" onClick={returnToMainMenu}><b><i className="bi bi-arrow-left" alt="back"></i></b></button>}
                <h4 className="text-left text-transition align-self-center m-0">Visualization</h4>
              </div>
              {(mainMenu) ? null:<button className="btn btn-link align-self-center me-3" onClick={fullScreenHandle.enter}><b><i className="bi bi-arrows-fullscreen" alt="full-screen"></i></b></button>}
            </div>
            <FullScreen handle={fullScreenHandle} className="full-width h-100">
              <div className="full-width h-100">
                {function renderStream() {
                  if (mainMenu) {
                    return <RenderVisualizationCards setVisParameters={setVisParameters} setSelectedVisParams={setSelectedVisParams} setMainMenu={setMainMenu} />;
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
    </div>

  );
}

export default App;
