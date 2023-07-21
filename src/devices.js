import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import AvailableDataInformation from "./availableData";
import CortexComp from './components/cortex';

function DeviceButton({data, handleShow, deviceStates}) {
return (
    <button type="button" className={(deviceStates[data.heading])?"list-group-item list-group-item-action list-devices shadow-sm active":"list-group-item list-group-item-action list-devices shadow-sm"} onClick={()=>handleShow(data)}>
        <div className="d-flex w-100 justify-content-between mt-2">
        <h5 className="mb-1">{data.heading}</h5>
        <small>{data.type}</small>
        </div>
        <p className="mb-2">{data.description}</p>
    </button>
);
}

export default function RenderDevices({data, deviceStates, handleDeviceStates, deviceStream, handleValue}) {
    const [activeData, setActiveData] = useState(data[1]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    function handleShow(data) {setShow(true); setActiveData(data)}

    const deviceButtonList=data?.map((datos) => {
    return (<DeviceButton 
        data={datos}
        setDeviceActive={()=>handleDeviceStates(datos.heading)} 
        key={datos.heading}
        handleShow={handleShow}
        deviceStates={deviceStates}
    ></DeviceButton>)});

    return (
    <div>
        {/*<div><Expand data={data} key="General"/></div>*/}
        <div className="mt-3">
            <ul className="list-group">
            {deviceButtonList}
            </ul>
        </div>
        <ConnectionWindow show={show} handleClose={handleClose} data={activeData} setDeviceActive={()=>handleDeviceStates(activeData.heading)} deviceStates={deviceStates} deviceStream={deviceStream} handleValue={handleValue}/>
    </div>
    );


}

function ConnectionWindow({show, handleClose, data, setDeviceActive, deviceStates, deviceStream, handleValue}) {

    const source={};
    source[data.heading]=true;

    function handleActive() {
        setDeviceActive();
    }

    return (
    <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{data.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data.description}
            <div className='mt-3'>
                <h6>Available data streams</h6>
                <p>This device can stream the following data to a visualization. Hover to learn more.</p>
                <AvailableDataInformation source={source} popupInfo={[data]}/>
            </div>
        </Modal.Body>
        <Modal.Footer>
            {(!deviceStates[data.heading])?
            (<button type="button" className="btn btn-outline-dark" onClick={handleActive}><i className="bi bi-bluetooth me-2"></i>Connect</button>):
            (<div><button type="button" className="btn btn-outline-danger" onClick={setDeviceActive}>Disconnect</button></div>)}
        </Modal.Footer>
     </Modal>
    )
}