import React from 'react';
import Expand from "./expandable";

function DeviceButton({name, setDeviceActive}) {
return (
    <button type="button" className="list-group-item list-group-item-action list-devices" data-bs-toggle="button" onClick={setDeviceActive}>
    <div className="d-flex w-100 justify-content-between">
    <h5 className="mb-1">{name}</h5>
    <small>EEG device</small>
    </div>
    <p className="mb-1">Some placeholder content in a paragraph.</p>
    <small>And some small print.</small>
</button>
);
}

export function DeviceCard({content}) {
return (
    <div className="card">
    <div className="card-body">
        <p className="card-text">{content}</p>
    </div>
        <button type="button" className="btn btn-primary">Connect</button>
    </div>
);
}

export default function RenderDevices({data, deviceStates, handleDeviceStates}) {
  // If I declared handleDeviceStates as an array, I'd need to use the find method
  const deviceButtonList=data?.map((datos) => 
    <DeviceButton 
      name={datos.heading} 
      setDeviceActive={()=>handleDeviceStates(datos.heading)} 
      key={datos.heading}
    />);

    return (
    <div>
        {/*<div><Expand data={data} key="General"/></div>*/}
        <div className="mt-3">
            <ul className="list-group">
            {deviceButtonList}
            </ul>
        </div>
    </div>
    );


}
