import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import AvailableDataInformation from "./availableData";

function DeviceButton({data, handleShow, deviceStates}) {
return (
    
    <button type="button" className={(deviceStates[data.heading])?"list-group-item list-group-item-action list-devices active":"list-group-item list-group-item-action list-devices"} onClick={()=>handleShow(data)}>
        <div className="d-flex w-100 justify-content-between mt-2">
        <h5 className="mb-1">{data.heading}</h5>
        <small>{data.type}</small>
        </div>
        <p className="mb-2">{data.description}</p>
    </button>
);
}

export default function RenderDevices({data, deviceStates, deviceStreamFunctions}) {
    const [activeData, setActiveData] = useState(data[1]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    function handleShow(data) {setShow(true); setActiveData(data)}

    const deviceButtonList=data?.map((datos) => {
    return (<DeviceButton 
        data={datos}
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
        <ConnectionWindow show={show} handleClose={handleClose} data={activeData} streamFunction={deviceStreamFunctions[activeData.heading]}/>
    </div>
    );


}

function ConnectionWindow({show, handleClose, data, streamFunction}) {
    const source={};
    source[data.heading]=true;

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
        {streamFunction}
     </Modal>
    )
}